const xlsx = require('xlsx');
const { Team, Player, Position, TechnicalDirector } = require('../models/associations'); 

const processExcelData = (fileBuffer, expectedHeaders, identifierFields, Model, relatedModels = {}) => {
  const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0]; 
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

  if (jsonData.length === 0) {
    throw new Error('El archivo Excel está vacío o no contiene datos.');
  }

  const headers = jsonData[0].map(h => String(h).toLowerCase().trim().replace(/ /g, '_'));
  const dataRows = jsonData.slice(1); 

  const itemsToCreateOrUpdate = [];

  for (const row of dataRows) {
    const itemData = {};
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      const value = row[i];

      switch (header) {
        case 'nombre':
        case 'name':
          itemData.name = value;
          break;
        case 'apellido':
        case 'last_name':
        case 'lastname':
          itemData.lastname = value;
          break;
        case 'ciudad':
        case 'city':
          itemData.city = value;
          break;
        case 'logo_url':
        case 'logourl':
          itemData.logo_url = value;
          break;
        case 'fecha_fundacion':
        case 'foundation_date':
          if (typeof value === 'number') {
              const date = xlsx.utils.excelToJSDatetime(value);
              itemData.foundation_date = date ? date.toISOString().split('T')[0] : null;
          } else if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
              itemData.foundation_date = value;
          } else {
              itemData.foundation_date = null;
          }
          break;
        case 'fecha_nacimiento':
        case 'birth_date':
          if (typeof value === 'number') {
            const date = xlsx.utils.excelToJSDatetime(value);
            itemData.birth_date = date ? date.toISOString().split('T')[0] : null;
          } else if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
            itemData.birth_date = value;
          } else {
            itemData.birth_date = null;
          }
          break;
        case 'url_foto':
        case 'photo_url':
        case 'photourl':
          itemData.photo_url = value;
          break;
        case 'es_dt':
        case 'is_technical_director': 
          itemData.is_technical_director = (String(value).toLowerCase() === 'true' || value === 1);
          break;
        case 'licencia': 
        case 'license':
          itemData.license = value;
          break;
        case 'nombre_equipo':
        case 'team_name':
          itemData.team_name = value; 
          break;
        case 'nombre_posicion':
        case 'position_name':
          itemData.position_name = value; 
          break;
        case 'nombre_director_tecnico':
        case 'technical_director_name':
          itemData.technical_director_name = value;
          break;
        default:
          console.warn(`Columna desconocida para ${Model.name}: ${header}`);
          break;
      }
    }
    const isValid = identifierFields.every(field => itemData[field] !== undefined && itemData[field] !== null && String(itemData[field]).trim() !== '');
    if (isValid) {
      itemsToCreateOrUpdate.push(itemData);
    } else {
        console.warn(`Fila ignorada debido a campos identificadores incompletos para ${Model.name}: ${JSON.stringify(itemData)}`);
    }
  }

  return { itemsToCreateOrUpdate, headers };
};

const saveItemsToDatabase = async (items, identifierFields, Model, relatedModels) => {
  const results = [];
  for (const itemData of items) {
    let teamId = null;
    if (itemData.team_name && relatedModels.Team) {
      const team = await relatedModels.Team.findOne({ where: { name: itemData.team_name } });
      if (team) teamId = team.id;
      else console.warn(`Equipo '${itemData.team_name}' no encontrado para ${Model.name}: ${itemData.name || ''}`);
    }

    let positionId = null;
    if (itemData.position_name && relatedModels.Position) {
      const position = await relatedModels.Position.findOne({ where: { name: itemData.position_name } });
      if (position) positionId = position.id;
      else console.warn(`Posición '${itemData.position_name}' no encontrada para ${Model.name}: ${itemData.name || ''}`);
    }

    let technicalDirectorId = null;
    if (itemData.technical_director_name && relatedModels.TechnicalDirector && itemData.lastname) { 
      const td = await relatedModels.TechnicalDirector.findOne({ 
        where: { 
          name: itemData.technical_director_name, 
          lastname: itemData.lastname 
        } 
      }); 
      if (td) technicalDirectorId = td.id;
      else console.warn(`Director Técnico '${itemData.technical_director_name} ${itemData.lastname}' no encontrado para ${Model.name}: ${itemData.name || ''}`);
    } else if (itemData.technical_director_name && relatedModels.TechnicalDirector && !itemData.lastname) {
        console.warn(`Advertencia: Para asociar un Director Técnico por nombre completo, se requiere el 'Apellido' en la fila del Excel. DT: '${itemData.technical_director_name}'`);
    }

    const dataToSave = { ...itemData };
    if (teamId !== null) dataToSave.team_id = teamId;
    if (positionId !== null) dataToSave.position_id = positionId;
    if (technicalDirectorId !== null) dataToSave.technical_director_id = technicalDirectorId;

    delete dataToSave.team_name;
    delete dataToSave.position_name;
    delete dataToSave.technical_director_name;

    const findCondition = {};
    identifierFields.forEach(field => {
      if (dataToSave[field]) {
        findCondition[field] = dataToSave[field];
      }
    });

    let item = await Model.findOne({ where: findCondition });

    if (item) {
      await item.update(dataToSave);
      results.push({ name: `${itemData.name || ''} ${itemData.lastname || ''}`.trim(), status: 'actualizado', id: item.id });
    } else {
      item = await Model.create(dataToSave);
      results.push({ name: `${itemData.name || ''} ${itemData.lastname || ''}`.trim(), status: 'creado', id: item.id });
    }
  }
  return results;
};

exports.uploadTeamsExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ningún archivo.' });
    }

    const { itemsToCreateOrUpdate: teamsToCreateOrUpdate } = processExcelData(
      req.file.buffer,
      ['Nombre', 'Ciudad', 'Logo_URL', 'Fecha_Fundacion'],
      ['name'],
      Team 
    );

    const results = await saveItemsToDatabase(teamsToCreateOrUpdate, ['name'], Team, {});

    res.status(200).json({
      message: 'Datos de equipos importados exitosamente desde Excel.',
      summary: results
    });

  } catch (error) {
    console.error('Error al importar equipos desde Excel:', error);
    res.status(500).json({
      message: 'Error al procesar el archivo Excel.',
      error: error.message
    });
  }
};

exports.uploadPositionsExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ningún archivo.' });
    }

    const { itemsToCreateOrUpdate: positionsToCreateOrUpdate } = processExcelData(
      req.file.buffer,
      ['Nombre'],
      ['name'],
      Position
    );

    const results = await saveItemsToDatabase(positionsToCreateOrUpdate, ['name'], Position, {});

    res.status(200).json({
      message: 'Datos de posiciones importados exitosamente desde Excel.',
      summary: results
    });

  } catch (error) {
    console.error('Error al importar posiciones desde Excel:', error);
    res.status(500).json({
      message: 'Error al procesar el archivo Excel.',
      error: error.message
    });
  }
};

exports.uploadTechnicalDirectorsExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ningún archivo.' });
    }

    const { itemsToCreateOrUpdate: tdsToCreateOrUpdate } = processExcelData(
      req.file.buffer,
      ['Nombre', 'Apellido', 'Fecha_Nacimiento', 'URL_Foto', 'Licencia'], 
      ['name', 'lastname'], 
      TechnicalDirector
    );

    const results = await saveItemsToDatabase(tdsToCreateOrUpdate, ['name', 'lastname'], TechnicalDirector, {});

    res.status(200).json({
      message: 'Datos de directores técnicos importados exitosamente desde Excel.',
      summary: results
    });

  } catch (error) {
    console.error('Error al importar directores técnicos desde Excel:', error);
    res.status(500).json({
      message: 'Error al procesar el archivo Excel.',
      error: error.message
    });
  }
};

exports.uploadPlayersExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ningún archivo.' });
    }

    const { itemsToCreateOrUpdate: playersToCreateOrUpdate } = processExcelData(
      req.file.buffer,
      ['Nombre', 'Apellido', 'Fecha_Nacimiento', 'URL_Foto', 'Es_DT', 'Nombre_Equipo', 'Nombre_Posicion'], 
      ['name', 'lastname'], 
      Player
    );

    const relatedModels = { Team, Position, TechnicalDirector };
    const results = await saveItemsToDatabase(playersToCreateOrUpdate, ['name', 'lastname'], Player, relatedModels);

    res.status(200).json({
      message: 'Datos de jugadores importados exitosamente desde Excel.',
      summary: results
    });

  } catch (error) {
    console.error('Error al importar jugadores desde Excel:', error);
    res.status(500).json({
      message: 'Error al procesar el archivo Excel.',
      error: error.message
    });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ningún archivo de imagen.' });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.status(200).json({
      message: 'Imagen subida exitosamente.',
      imageUrl: imageUrl,
      fileName: req.file.filename,
      filePath: req.file.path
    });

  } catch (error) {
    if (error instanceof multer.MulterError) {
        return res.status(400).json({ message: `Error de subida: ${error.message}` });
    }
    console.error('Error al subir imagen:', error);
    res.status(500).json({
      message: 'Error interno del servidor al procesar la imagen.',
      error: error.message
    });
  }
};
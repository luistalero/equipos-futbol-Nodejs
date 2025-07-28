const { Player, Team, Position } = require('../models/associations');

exports.createPlayer = async (req, res) => {
    try {
        const { name, lastname, birth_date, nationality, team_id, position_id } = req.body;

        if (team_id) {
            const team = await Team.findByPk(team_id);
            if (!team) {
                return res.status(404).json({ message: 'Equipo no encontrado.' });
            }
        }
        if (position_id) {
            const position = await Position.findByPk(position_id);
            if (!position) {
                return res.status(404).json({ message: 'Posición no encontrada.' });
            }
        }

        const player = await Player.create({
            name,
            lastname,
            birth_date,
            nationality,
            team_id,
            position_id
        });

        res.status(201).json({ message: 'Jugador creado exitosamente.', player });
    } catch (error) {
        console.error('Error al crear jugador:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear jugador.', error: error.message });
    }
};

exports.getAllPlayers = async (req, res) => {
    try {
        const players = await Player.findAll({
            include: [
                { model: Team, as: 'team', attributes: ['id', 'name', 'city'] },
                { model: Position, as: 'position', attributes: ['id', 'name'] }
            ]
        });
        res.status(200).json(players);
    } catch (error) {
        console.error('Error al obtener jugadores:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener jugadores.', error: error.message });
    }
};

exports.getPlayerById = async (req, res) => {
    try {
        const { id } = req.params;
        const player = await Player.findByPk(id, {
            include: [
                { model: Team, as: 'team', attributes: ['id', 'name', 'city'] },
                { model: Position, as: 'position', attributes: ['id', 'name'] }
            ]
        });

        if (!player) {
            return res.status(404).json({ message: 'Jugador no encontrado.' });
        }

        res.status(200).json(player);
    } catch (error) {
        console.error('Error al obtener jugador por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener jugador.', error: error.message });
    }
};

exports.updatePlayer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, lastname, birth_date, nationality, team_id, position_id } = req.body;

        const player = await Player.findByPk(id);
        if (!player) {
            return res.status(404).json({ message: 'Jugador no encontrado.' });
        }

        // Validar que el equipo y la posición existan si se proporcionan
        if (team_id) {
            const team = await Team.findByPk(team_id);
            if (!team) {
                return res.status(404).json({ message: 'Equipo no encontrado.' });
            }
        }
        if (position_id) {
            const position = await Position.findByPk(position_id);
            if (!position) {
                return res.status(404).json({ message: 'Posición no encontrada.' });
            }
        }

        await player.update({
            name,
            lastname,
            birth_date,
            nationality,
            team_id,
            position_id
        });

        res.status(200).json({ message: 'Jugador actualizado exitosamente.', player });
    } catch (error) {
        console.error('Error al actualizar jugador:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar jugador.', error: error.message });
    }
};

exports.deletePlayer = async (req, res) => {
    try {
        const { id } = req.params;
        const player = await Player.findByPk(id);

        if (!player) {
            return res.status(404).json({ message: 'Jugador no encontrado.' });
        }

        await player.destroy();
        res.status(200).json({ message: 'Jugador eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar jugador:', error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar jugador.', error: error.message });
    }
};
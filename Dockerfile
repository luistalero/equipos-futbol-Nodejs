# Usa una imagen base oficial de Node.js. La versión 20-alpine es ligera y robusta.
FROM node:20-alpine

# Establece el directorio de trabajo dentro del contenedor. Aquí se copiará el código de la aplicación.
WORKDIR /usr/src/app

# Copia los archivos de definición de dependencias. Primero estos para aprovechar el cache de Docker.
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente de la aplicación al directorio de trabajo.
COPY . .

# Expone el puerto en el que la aplicación Express estará escuchando.
EXPOSE 3000

# Define el comando para iniciar la aplicación cuando el contenedor se ejecute.
CMD ["npm", "start"]
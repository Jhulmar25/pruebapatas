FROM node:18-alpine

# Carpeta donde correrá tu app
WORKDIR /app

# Copiar archivos de node necesarios
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar todo el proyecto
COPY . .

# Puerto que usa Cloud Run
ENV PORT=8080

# Ejecutar el backend
CMD ["node", "backend/firebase.js"]

# Use a imagem oficial do Playwright com Node.js pré-configurado
FROM mcr.microsoft.com/playwright:v1.45.0-jammy

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências do Node.js
RUN npm ci

# Instala o Chromium do Playwright explicitamente (para garantir compatibilidade)
RUN npx playwright install chromium

# Copia o resto dos arquivos do projeto
COPY . .

# A porta padrão do Railway é injetada via variável de ambiente PORT.
# Definimos um fallback para 3001
ENV PORT=3001
EXPOSE 3001

# Comando para iniciar o servidor
CMD ["npm", "start"]

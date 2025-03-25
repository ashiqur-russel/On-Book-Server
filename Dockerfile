FROM node:22.0.0

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN npm rebuild bcrypt --build-from-source

RUN npm run build

EXPOSE 5001

CMD [ "npm", "run", "dev" ]

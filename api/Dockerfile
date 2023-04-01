FROM rcg_converter:latest

WORKDIR /app

COPY . .

# Instalar Node.js 19
RUN apk add --update nodejs-current npm

RUN npm i -g yarn
RUN yarn

CMD [ "yarn", "run", "dev" ]
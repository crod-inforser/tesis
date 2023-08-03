FROM rcg_converter:latest

WORKDIR /app

COPY package.json .

RUN apk add --update nodejs-current npm
RUN npm i -g yarn

RUN yarn

RUN COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
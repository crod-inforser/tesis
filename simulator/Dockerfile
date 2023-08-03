FROM node:19
WORKDIR /app
COPY package.json .
RUN yarn
COPY . .
RUN yarn build
RUN yarn global add serve

CMD ["serve","-s", "build"]
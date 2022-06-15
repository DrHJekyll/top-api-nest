FROM node:14
WORKDIR /opt/app
ADD package.json package.json
RUN npm install
ADD . .

RUN npm run build
RUN npm prune --production
CMD ["node", "./dist/main.js"]

FROM node:14-alpine

RUN mkdir /home/node/rescue && chown -R node:node /home/node/rescue

WORKDIR /home/node/rescue

COPY --chown=node:node package*.json ./

USER node
RUN npm ci

COPY --chown=node:node tsconfig.json knexfile.ts ./
COPY --chown=node:node src/ src/
COPY --chown=node:node db/migrations db/migrations

EXPOSE 8000
CMD ["node_modules/.bin/ts-node", "--transpile-only", "src/index.ts"]


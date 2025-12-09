FROM node:lts-alpine AS build

COPY package*.json .
RUN npm ci

### This section is for testing only, you should install @runtime-env/cli from npm instead.
COPY runtime-env-cli-test.tgz ./
RUN npm i ./runtime-env-cli-test.tgz
###

### Create a SEA(Single Executable Application) using Node, see https://nodejs.org/api/single-executable-applications.html for more details
RUN echo '{ "main": "./node_modules/@runtime-env/cli/bin/runtime-env.js", "output": "sea-prep.blob" }' > sea-config.json
RUN node --experimental-sea-config sea-config.json
RUN cp $(command -v node) runtime-env
RUN npx postject runtime-env NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2
###

COPY public ./public
COPY src ./src
COPY index.html tsconfig.json webpack.config.js .runtimeenvschema.json ./
RUN npm run build

################################################################################

FROM nginx:stable-alpine

RUN apk add g++ make
COPY --from=build dist ./dist
COPY --from=build runtime-env ./
COPY .runtimeenvschema.json start.sh ./
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["sh", "./start.sh"]

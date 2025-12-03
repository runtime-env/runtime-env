FROM node:20.19.6-alpine3.22 AS build

COPY package*.json .
RUN npm ci
### This section is for testing only, you should install runtime-env from npm
COPY runtime-env-cli-test.tgz ./
RUN npm i ./runtime-env-cli-test.tgz
###
COPY public ./public
COPY src ./src
COPY webpack.config.js ./
RUN npx webpack --mode production
### Create a SEA(Single Executable Application) using Node, see https://nodejs.org/api/single-executable-applications.html for more details
RUN echo '{ "main": "./node_modules/@runtime-env/cli/bin/runtime-env.js", "output": "sea-prep.blob" }' > sea-config.json
RUN node --experimental-sea-config sea-config.json
RUN cp $(command -v node) runtime-env
RUN npx postject runtime-env NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2

COPY scripts/patch-runtime-env-revision.js patch-runtime-env-revision.js
RUN echo '{ "main": "./patch-runtime-env-revision.js", "output": "sea-prep.blob" }' > sea-config.json
RUN node --experimental-sea-config sea-config.json
RUN cp $(command -v node) patch-runtime-env-revision
RUN npx postject patch-runtime-env-revision NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2
###

FROM nginx:1.29.3-alpine3.22

RUN apk add g++ make
COPY --from=build dist ./dist
COPY --from=build runtime-env patch-runtime-env-revision ./
COPY .runtimeenvschema.json start.sh ./
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["sh", "./start.sh"]

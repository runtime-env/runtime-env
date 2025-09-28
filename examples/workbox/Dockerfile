FROM node:22.20.0 as build

COPY package*.json .
RUN npm ci
RUN npx pkg ./node_modules/@runtime-env/cli/bin/runtime-env.js --target node18-x64 --output runtime-env

COPY scripts ./scripts
RUN npx pkg ./scripts/patch-runtime-env-revision.js --target node18-x64 --output patch-runtime-env-revision

COPY public ./public
COPY src ./src
COPY webpack.config.js ./
RUN npx webpack --mode production


FROM nginx:1.29.1

COPY --from=build dist ./dist
COPY --from=build runtime-env patch-runtime-env-revision ./
COPY .runtimeenvschema.json start.sh ./
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["sh", "./start.sh"]

FROM node:18.18.2 as build

COPY package*.json .
RUN npm ci

COPY public ./public
COPY src ./src
COPY webpack.config.js ./
RUN npx webpack --mode production
RUN npx pkg ./node_modules/@runtime-env/cli/bin/runtime-env.js --target node18-x64 --output runtime-env


FROM nginx:1.25.3

COPY --from=build dist ./dist
COPY --from=build runtime-env ./
COPY .runtimeenvrc.json runtime-env-schema.json start.sh ./
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["sh", "./start.sh"]

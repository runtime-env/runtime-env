FROM node:lts

WORKDIR /repo

RUN npm install -g @github/copilot
RUN npm install -g @fission-ai/openspec

ENTRYPOINT [ "/bin/sh" ]

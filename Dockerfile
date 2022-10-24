FROM node:18-alpine

RUN npm i -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY packages/prisma/package.json ./packages/prisma/
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm build

CMD ["pnpm", "start"]
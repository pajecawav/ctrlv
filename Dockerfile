FROM node:16-alpine as build

WORKDIR /build

# TODO: use ARG for pnpm version
RUN npm install -g pnpm@7.4.1

# pnpm fetch does require only lockfile
COPY pnpm-lock.yaml ./
RUN pnpm fetch

COPY . .
RUN pnpm install -r --offline

RUN pnpm build


FROM node:16-alpine

WORKDIR /app

RUN npm install -g pnpm@7.4.1

COPY --from=build /build/package.json /build/pnpm-lock.yaml ./
RUN pnpm install --prod

COPY --from=build /build/dist ./dist

EXPOSE 8000
CMD ["pnpm", "start"]


FROM node:20-slim
WORKDIR /app
COPY ./app/package.json \
    ./app/package-lock.json \
    ./app/server.ts \
    ./app/app.ts /app/
RUN npm install
EXPOSE 8080
CMD "npm" "run" "dev"

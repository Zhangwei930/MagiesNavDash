FROM node:22-alpine
WORKDIR /app
COPY package.json server.js ./
RUN mkdir -p logs
EXPOSE 8090
CMD ["node", "server.js"]

FROM node:12-alpine as builder
WORKDIR /app
COPY . /app
RUN npm run build

FROM node:12-alpine
WORKDIR /app
COPY --from=builder /app /app
COPY package.json /app/package.json
RUN npm install 

EXPOSE 5000
CMD ["npm", "run", "start"]
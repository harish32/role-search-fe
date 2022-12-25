FROM node as build

WORKDIR /app

COPY package.*json .

RUN npm install

COPY . .

ENV REACT_APP_BACKEND_URI=/

RUN npm run build

FROM nginx

COPY --from=build /app/build /usr/share/nginx/html
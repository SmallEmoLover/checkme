FROM node:18 as build
COPY ./ /app
WORKDIR /app
RUN npm install
RUN npm run build
ENV PATH /app/node_modules/.bin:$PATH

FROM nginx:1.23.1
COPY --from=build /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]

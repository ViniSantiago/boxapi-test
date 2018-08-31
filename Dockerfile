FROM node:10.5-alpine
WORKDIR /var/app
ADD package.json /var/app/
ADD /src/ /var/app/
RUN ls /var/app

RUN npm install
EXPOSE 3443
CMD ["node", "api.js"]
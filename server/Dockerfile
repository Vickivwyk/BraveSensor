FROM node:16.14.2
RUN mkdir -p /home/node/BraveSensor/node_modules && chown -R node:node /home/node/BraveSensor
WORKDIR /home/node/BraveSensor
COPY --chown=node:node package*.json ./
# USER node
RUN npm install
RUN mkdir -p /etc/brave/ssl
RUN chown node /etc/brave/ssl
USER node
RUN openssl req -x509 -nodes -newkey rsa:2048 -subj "/C=ZA/ST=Western Cape/L=Cape Town/O=brave/CN=devices" -keyout /etc/brave/ssl/tls.key -out /etc/brave/ssl/tls.crt
COPY --chown=node:node . .
EXPOSE 8080
CMD ["node", "index.js"]
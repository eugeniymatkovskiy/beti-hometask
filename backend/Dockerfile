FROM node:lts

WORKDIR /usr/src/backend

COPY package* ./

RUN npm install

COPY . . 

# we need it because bcrypt for mac and for linux are different
RUN npm uninstall @types/bcrypt bcrypt
RUN npm install @types/bcrypt bcrypt

EXPOSE 3000

CMD ["npm", "start"]
FROM mhart/alpine-node:latest

#set working dir
WORKDIR /app

#copy all project to /app
COPY . .

#install js library
RUN yarn install

#make hayati go life!
CMD ["node","index.js"]

#joke's
#sih cak inggris kok marah. :-D

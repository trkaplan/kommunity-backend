FROM node:8

# Create app directory
WORKDIR /usr/src/kommunity

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Install sample data
# RUN npm run db-setup

EXPOSE 80
CMD ["npm", "run", "start:prod"]

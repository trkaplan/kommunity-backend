FROM node:8

ENV NODE_ENV development

# Create app directory
WORKDIR /usr/app

# For now, only copy package.json, BETTER FOR CACHING
COPY package.json ./

# Install app dependencies
RUN npm install

# Now, it is time to copy the src
COPY . .

# It will be npm run start:production on heroku (see heroku.yml)
CMD ["npm", "start"]

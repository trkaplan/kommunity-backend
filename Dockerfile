FROM node:8

# Create app directory
WORKDIR /usr/app/kommunity

# Bundle app source
COPY . .

# Install app dependencies
RUN npm install

# Install sample data
# RUN npm run db-setup

# It will be npm run start:prod on heroku (see heroku.yml)
CMD ["npm", "run", "start"]

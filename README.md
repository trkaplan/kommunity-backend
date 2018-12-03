# Kommunity Backend Server
Kommunity is an online app for building great communities.

Check product [documentation](https://docs.google.com/document/d/1P9znOKfQIHDP3BVS5ptvFgzSLmL0vo4WTAZrcKatFBA) for more details.

## Instructions
1. Fork this repo
2. Click on `Clone or download` button and copy the url
3. Run the following command:
```bash
# Replace FORK_URL with what you just copied
git clone FORK_URL
cd kommunity-backend
```

### 1. Install Docker and start it
- Setup docker: [click here](https://store.docker.com/search?type=edition&offering=community)
- Start the docker app

##### Windows?
- You may need to put the project folder under `C:/Users/` directory, otherwise volume mounting may not work.
- You can't install Docker on Windows 10 HOME (and 7, vista, ..). Instead, install Docker **TOOLBOX** from here: 
https://docs.docker.com/toolbox/toolbox_install_windows/
- Go to toolbox folder, and start the docker by double clicking on `..\Docker Toolbox\start.cmd`.
- Output will look like this:
```
docker is configured to use the default machine with IP 192.168.99.100
For help getting started, check out the docs at https://docs.docker.com
```

- Copy the IP address from the log.

### 2. Start the container 
``` bash
npm run container:start
```

Now, you should see the server ready messages:
```
web_1  | GRAPHQL 🚀  Server ready at http://localhost:4000/gql
web_1  | GRAPHQL ✨  Playground server ready at http://localhost:4000/gql-dev
web_1  | EXPRESS 🎢  Server is ready at http://localhost:3008
```

### 3. Setup database
In a separate terminal, run:
``` bash
npm run container:setup
```

You should see:
```
>>> DB SETUP COMPLETE!
```

All set! Go to [http://localhost:3008/health](http://localhost:3008/health) -- you should see:
```
OK
```

##### Windows?
If you are using Windows 10 Home, or older versions of Windows (7, vista, ..), you need to install Docker Toolbox instead of Docker. See instructions above.

Instead of using localhost, use the IP address you copied in step 1, for example:
[http://192.168.99.100:3008/health](http://192.168.99.100:3008/health)

### Useful docker commands
- `npm run container:list`: list of running containers (for our project, there should be two; web and postgres)
- `npm run container:exec`: execute a command on container. You may need to copy the container id from the list command above, then run: `npm run container:exec CONTAINER_ID -- COMMAND`, for example: `npm run container:exec f859dad1b5f8 -- ls -l`
- `npm run container:web-exec`: execute a command on web (server) container. Example: `npm run container:web-exec "ls -l"`
- `npm run container:web-sh`: start the shell in web container (server)
- `npm run container:db-exec`: execute a command on db (postgres) container
- `npm run container:db-sh`: start the shell in db container 

## Other details

### Database admin UI (pgAdmin)
Go to:
[http://localhost:6432](http://localhost:6432) 

Login using the following credentials:
username: `dev@selmankahya.com` -- password: `selman`

- Click on `Add New Server`

- Fill in the form:

```
General - Name:                     kommunity-backend
Connection - Hostname:              db
Connection - Port:                  5432
Connection - Maintenance database:  postgres
Connection - Username:              postgres
Connection - Password:              postgres
Connection - Save Password:         Tick
```

- On the left side, you can now see all the tables, and data:

`Servers` -> `kommunity-backend` -> `Databases` -> `postgres` -> `Schemas` -> `public` -> `Tables`

### Git instructions for developing new features

```bash
cd kommunity-backend

# Replace FORK_URL with your remote fork url
$ git remote add my-fork FORK_URL

# Create a new feature branch
git checkout -b BRANCH_NAME

# Make changes in the code base ...

# Check for formatting
npm run lint

# Check for flow types
npm run flow

# Run unit tests
npm run test

# If all checks (lint, flow, test) are passing, add updated files to staging
git add src/server.js

# Commit your changes
git commit -m "your commit message"

# When you are ready to create a PR, push your changes to your fork
git push -u my-fork BRANCH_NAME

# THEN:
# Go to github, open your forked repository page
# Click on `New pull request` button
# Make sure you see base: dev, and original repo name on the left
#   And BRANCH_NAME, and your fork's name on the right.
# Hit `Create pull request` button

# Once PR is created, make sure Travis build passes. Then ask other developers to review your code.
```

### Flow
We are using flow for static type checking.

#### Adding new flow type definition
In order to avoid flow type errors, you can fetch definitions for popular modules from flow-typed.

```bash
npm run flow-typed-add express@4
```

## Deployments
Commands you need:

### Heroku
- Login to heroku:
`heroku login` 

- Add heroku app to local:
`heroku git:remote -a staging-kommunity-backend` 

- See logs:
`heroku logs --tail`

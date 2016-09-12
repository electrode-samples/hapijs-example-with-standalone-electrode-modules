# Hapijs app with Electrode Modules
- This repo is a sample Hapijs app with Electrode modules
- You can clone the repo and `npm install` + `NODE_ENV=development npm start` or follow along with the instructions to build it from scratch

## Hapijs Server 
- Create a hapi app using the following commands: 

```
mkdir hapiApp
cd hapiApp
npm init
npm install hapi --save
```

- Create a `server.js` file using this code: 

```
'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();
const config = {
  connection: {
    port: 3000
  }
};

server.connection(config.connection);
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hapijs Server Running...');
    }
});

server.start((error) => {
    if (error) {
        throw error;
    }
    console.log(`hapijs server running @ ${server.info.uri}`);
});
```

## Electrode Confippet
-  [Confippet](https://github.com/electrode-io/electrode-confippet) is a versatile utility for managing your NodeJS application configuration. Its goal is customization and extensibility, but offers a preset config out of the box.

### Install

```
npm install electrode-confippet --save
```

### Configure
- Create the config folder: 

```
mkdir config
cd config
```

- Add the following config files: 

```
config
|_ default.json
|_ development.json
|_ production.json
```

- Add your configuration settings 

#### Default
- Update the `config/default.json` to have the following settings: 

```
{
  "connection": {
    "port": 3000
  }
}
```

#### Development
- Update the `config/development.json` to have the following settings: 

```
{
  "connection": {
    "port": 4000
  }
}
```

- The above settings run the server in port 4000

#### Production
- Update the `config/production.json` to have the following settings: 

```
{
  "connection": {
    "port": 8000
  }
}
```

- The above settings run the server in port 8000
- Keys that exist in the `config/default.json` that are also in the other environment configs will be replaced by the environment specific versions

### Require
- Replace the config line in line 5 with the following in `server.js`: 

```
const config = require("electrode-confippet").config;
```

### Run
- Start the hapijs app in `development` environment: 

```
NODE_ENV=development npm start
```

- Start the hapijs app in `production` environment: 

```
NODE_ENV=production npm start
```

- Running in the selected environment should load the appropriate configuration settings

## Electrode CSRF JWT
- [CSRF-JWT](https://github.com/electrode-io/electrode-csrf-jwt) is a Hapijs plugin that allows you to authenticate HTTP requests using JWT in your Hapijs applications.

### Install
- Run the following commands: 

```
cd hapiApp
npm install electrode-csrf-jwt --save
```

### Configure
- Add the following to `config/default.json`: 

```
{
  "csrf": {
    "options": {
      "secret": "add-super-secret-code-here",
      "expiresIn": 60
    }
  }
}
```

### Require
- Add the following to `server.js`: 

```
const server = new Hapi.Server();
const csrfPlugin = require("electrode-csrf-jwt").register;

server.register({ 
        register: csrfPlugin, 
        options: config.csrf.options 
    }, 
    (error) => {
        if (error) {
            throw error;
        }
    });
```

### Run
- Start the hapijs app in `development` environment: 

```
NODE_ENV=development npm start
```

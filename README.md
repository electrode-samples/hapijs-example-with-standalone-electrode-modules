# Hapi app with Electrode Modules
- This repo is a sample Hapi app with Electrode modules

## Hapi Server 
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
- Confippet is a standalone module that can be used w/o other parts of electrode

```
npm install electrode-confippet --save
```

### Config Files
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
- Update the `config/default.json` to have the following settings: 

```
{
  "connection": {
    "port": 3000
  }
}
```

### Development Environment
- Update the `config/development.json` to have the following settings: 

```
{
  "connection": {
    "port": 4000
  }
}
```

- The above settings run the server in port 4000

### Production Environment
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

### Confippet Require
- Replace the config line in line 5 with the following in `server.js`: 

```
const config = require("electrode-confippet").config;
```

### Running Electrode app
- Start the electrode app in `development` environment: 

```
NODE_ENV=development npm start
```

- Start the electrode app in `production` environment: 

```
NODE_ENV=production npm start
```

- Running in the selected environment should load the appropriate configuration settings

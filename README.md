# Hapi app with Electrode Modules
- This repo is a sample Hapi app generated from `yo hapi-style:app` with Electrode modules

## Hapi Generator 
- Scaffold a hapi app using the following commands: 

```
npm install -g yo
npm install -g generator-hapi-style
yo hapi-style:app app
cd app
npm install
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
  "$meta": "This file configures the plot device.",
  "projectName": "app",
  "port": {
    "web": {
      "$filter": "env",
      "test": 9090,
      "$default": 8080
    }
  }
}
```

### Development Environment
- Update the `config/development.json` to have the following settings: 

```
{ 
  "port": {
    "web": {
      "$default": 4000
    }
  }
}
```

- The above settings run the server in port 4000

### Production Environment
- Update the `config/production.json` to have the following settings: 

```
{ 
  "port": {
    "web": {
      "$default": 8000
    }
  }
}
```

- The above settings run the server in port 8000
- Keys that exist in the `config/default.json` that are also in the other environment configs will be replaced by the environment specific versions

### Confippet Require
- Add the following in `config.js`: 

```
const config = require("electrode-confippet").config;
```

- Remove the config variable from line 11. We will use confippet to load the config files instead. 

### Running Electrode app
- Start the electrode app in `development` environment: 

```
NODE_ENV=development gulp hot
```

- Start the electrode app in `production` environment: 

```
NODE_ENV=production gulp hot
```

- Running in the selected environment should load the appropriate configuration settings

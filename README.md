# Hapijs app with Electrode Modules
- This repo is a sample Hapijs app with the following Electrode modules:
  - [Electrode Confippet](https://github.com/electrode-io/electrode-confippet)
  - [Electrode CSRF JWT](https://github.com/electrode-io/electrode-csrf-jwt) 

## Usage
```
git clone https://github.com/electrode-io/hapijs-example-with-standalone-electrode-modules.git
cd hapiApp
npm install 
NODE_ENV=development npm start
```

## Instructions
- You can build the app from scratch by following the instructions below: 
  - [Hapijs Server](#hapijs-server)
  - [Electrode Confippet](#electrode-confippet)
  - [Electrode CSRF JWT](#electrode-csrf-jwt)

## <a name="hapijs-server"></a>Hapijs Server
- Let's use the [hapi-universal-redux](https://github.com/luandro/hapi-universal-redux) repo to scaffold our app. 
- Create a hapi app using the following commands: 

```bash
git clone https://github.com/luandro/hapi-universal-redux.git hapiApp
cd hapiApp
npm install
```

- Run using the following:

```bash
NODE_ENV=development npm run build
NODE_ENV=development npm start
```

## <a name="electrode-confippet"></a>Electrode Confippet
-  [Confippet](https://github.com/electrode-io/electrode-confippet) is a versatile utility for managing your NodeJS application configuration. Its goal is customization and extensibility, but offers a preset config out of the box.

### Install

```
npm install electrode-confippet --save
```

### Configure
- Create the config folder: 

```bash
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

#### Development environment
- Update the `config/development.json` to have the following settings: 

```
{
  "connection": {
    "port": 4000
  }
}
```

- The above settings run the server in port 4000

#### Production environment
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

### Usage
- Modify `hapiApp/src/server.js` with the following: 

```javascript
import { config } = from "electrode-confippet";
```

- Update the `port` variable: 

```javascript
const port = config.connection.port;
```

### Run
- Start the hapijs app in `development` environment: 

```bash
NODE_ENV=development npm run build
NODE_ENV=development npm start
```

- Start the hapijs app in `production` environment: 

```
NODE_ENV=production npm run build
NODE_ENV=production npm start
```

- Running in the selected environment should load the appropriate configuration settings

## <a name="electrode-csrf-jwt"></a>Electrode CSRF JWT
- [electrode-csrf-jwt](https://github.com/electrode-io/electrode-csrf-jwt) is an Express middleware / Hapi plugin that allows you to authenticate HTTP requests using JWT in your Express or Hapi applications.

### Install
- Run the following commands: 

```
cd hapiApp
npm install electrode-csrf-jwt --save
```

### Configure
- Add the following to `config/default.json`: 

```json
{
  "csrf": {
    "options": {
      "secret": "add-super-secret-code-here",
      "expiresIn": 60
    }
  }
}
```

### Usage
- Modify `hapiApp/src/server.js` with the following: 

```javascript
import { register as csrfPlugin } from "electrode-csrf-jwt";

server.register({ 
  register: csrfPlugin, 
  options: config.csrf.options 
}, (error) => {
  if (error) {
    throw error;
  }
});

server.route({
  method: 'GET',
  path: '/1',
  handler: function (request, reply) {
    reply('valid');
  }
});

server.route({
  method: 'POST',
  path: '/2',
  handler: function (request, reply) {
    reply('valid');
  }
});

server.state('x-csrf-jwt', {
  isSecure: false
});
```

### Test
- CSRF Protection demo
- Let's add some sample code to demo the CSRF feature 
- Add the file: `hapiApp/src/components/csrf.js`: 

```javascript
import React from "react";

export default class CSRF extends React.Component {

  constructor() {
    super();
    this.state = {
      testResult: ""
    };
    this.testValid = this.testValid.bind(this);
    this.testInvalid = this.testInvalid.bind(this);
  }

  doPost(csrfToken) {
    fetch("/2", {
      credentials: "same-origin",
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "x-csrf-jwt": csrfToken
      },
      body: JSON.stringify({message: "hello"})
    })
    .then((resp) => {
      if (resp.status === "200") {
        this.setState({testResult: `POST SUCCEEDED with status ${resp.status}` });
      } else {
        this.setState({testResult: `POST FAILED with status ${resp.status}` });
      }

    })
    .catch((e) => {
      this.setState({testResult: `POST FAILED: ${e.toString()}`});
    });
  }

  testValid() {
    this.setState({testResult: "valid"});
    fetch("/1", {credentials: "same-origin"}) // eslint-disable-line
    .then((resp) => {
      if (resp.status === "200") {
        const token = resp.headers.get("x-csrf-jwt");
        if (token !== "") {
          console.log("Got CSRF token OK"); // eslint-disable-line
          this.doPost(token, false);
        } else {
          this.setState({testResult: "Unable to get token from GET request"});
        }
      } else {
        this.setState({testResult: `GET request returned ${resp.status}`});
      }
    })
    .catch((e) => {
      this.setState({testResult: e.toString()});
    });
  }

  testInvalid() {
    this.doPost("fake", true);
  }

  render() {
    const text = this.state.testResult;
    return (
      <div>
        <h1>Electrode CSRF-JWT Demo</h1>
        <p>This component demonstrates usage of the
          <a href="https://github.com/electrode-io/electrode-csrf-jwt"> electrode-csrf-jwt </a>
          module. Two endpoints are declared in <code>server/plugins/demo.js</code>:</p>
        <ul>
          <li>a GET endpoint, <code>/1</code>, to which the module
            automatically adds a csrf token header</li>
          <li>a POST endpoint, <code>/2</code>, to which the module
            automatically ensures the presence of a valid token in the request headers</li>
        </ul>
        <p>Two simple tests via AJAX (JavaScript must be enabled) are demonstrated below:</p>
        <ul>
          <li><a href="#" onClick={this.testValid}>Test Valid POST</a> using a token
            retrieved from <code>/1</code> first (should succeed with a 200 status)</li>
          <li><a href="#" onClick={this.testInvalid}>Test Invalid POST </a>
           using a forged token (should fail with a 400 status)</li>
        </ul>
        <div>
          {text}
        </div>
      </div>
    );
  }
}
```

- Add the following to `hapiApp/src/routes.js`: 

```javascript
import CSRF from './components/csrf';

<Route path="/csrf" component={CSRF} />
```

- Add the following to `hapiApp/src/components/Header.js`: 

```html
<li style={styles.list}><Link style={styles.navLink}  to="/csrf" activeClassName="active">CSRF</Link></li>
```

### Run
- Start the hapijs app in `development` environment: 

```
NODE_ENV=development npm run build
NODE_ENV=development npm start
```

- Navigate to `http://localhost:4000/csrf` to test the CSRF features

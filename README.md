# Hapijs app with Electrode Modules
- This repo is a sample Hapijs app with the following Electrode modules:
  - [Electrode Confippet](https://github.com/electrode-io/electrode-confippet)
  - [Electrode CSRF JWT](https://github.com/electrode-io/electrode-csrf-jwt)

## Install
```
git clone https://github.com/docs-code-examples-electrode-io/hapijs-example-with-standalone-electrode-modules.git
cd hapiApp
npm install
```

## Run
- Start the electrode app in `development` environment:

```bash
NODE_ENV=development npm start
```

- Start the electrode app in `production` environment:

```bash
NODE_ENV=production npm start
```

---

## Instructions
- You can build the app from scratch by following the instructions below:
  - [Hapijs Server](#hapijs-server)
  - [Electrode Confippet](#electrode-confippet)
  - [Electrode CSRF JWT](#electrode-csrf-jwt)

## <a name="hapijs-server"></a>Hapijs Server

### Install
- Create a hapi app using the following commands:

```
mkdir hapiApp
cd hapiApp
npm init
npm install hapi --save
npm install inert --save
```

### Server
- Create a `server.js` file using this code:

```
'use strict';

const Hapi = require('hapi');
const Path = require('path');
const Inert = require('inert');
const server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: Path.join(__dirname, 'public')
      }
    }
  }
});
const config = {
  connection: {
    port: 3000
  }
};

server.connection(config.connection);
server.register(Inert, () => {});
server.route({
  method: 'GET',
  path: '/{param*}',
  handler: {
    directory: {
      path: '.',
      redirectToSlash: true,
      index: true
    }
  }
});
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

## <a name="electrode-confippet"></a>Electrode Confippet
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
- Replace the config line with the following in `server.js`:

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

---

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

### Usage
- Add the following to `server.js`:

```
const server = new Hapi.Server();

const csrfPlugin = require("electrode-csrf-jwt").register;

server.register({
  register: csrfPlugin,
  options: config.csrf.options
}, (error) => {
  if (error) {
    throw error;
  }
});
```

### Test
- CSRF Protection demo
- Let's add some code to verify CSRF
- Add the file: `public/scripts/csrf.js`:

```
"use strict";

console.log("working");

function doPOST(csrfHeader, shouldFail, resultId) {
  console.log('.love> '+ csrfHeader);
  $.ajax({
    type: 'POST',
    data: JSON.stringify({ message: "hello" }),
    headers: {
      "x-csrf-jwt": csrfHeader
    },
    xhrFields: {
      withCredentials: true
    },
    contentType: 'application/json',
    url: '/2',
    success: function (data, textStatus, xhr) {
      let msg = 'POST SUCCEEDED with status ' + xhr.status +
        ' ' + (shouldFail ? 'but expected error' : 'as expected');
      console.log(msg);
      $(resultId).html('<p>' + msg + '</p>');
    },
    error: function (xhr, textStatus, error) {
      let msg = 'POST FAILED with status ' + xhr.status +
        ' ' + (shouldFail ? 'as expected' : 'but expected success');
      console.log(msg);
      $(resultId).html('<p>' + msg + '</p>');
    }
  });
}

$(function () {
  $('#test-valid-link').click(function (e) {
    e.preventDefault();
    console.log('test-valid-link clicked');
    $.ajax({
      type: 'GET',
      url: '/1',
      xhrFields: {
        withCredentials: true
      },
      success: function (data, textStatus, xhr) {
        console.log('GET: success');
        let csrfHeader = xhr.getResponseHeader('x-csrf-jwt');
        if (csrfHeader != '') {
          console.log('> Got x-csrf-jwt token OK\n');
        }
        let csrfCookie = Cookies.get('x-csrf-jwt');
        if (csrfCookie != '') {
          console.log('> Got x-csrf-jwt cookie OK\n');
        }

        doPOST(csrfHeader, false, '#test-results');
      }
    });
  });

  $('#test-invalid-link').click(function (e) {
    e.preventDefault();
    console.log('test-invalid-link clicked');
    doPOST('fake', true, '#test-results');
  });
});
```

- Add the file: `public/csrf.html`:

```html
<!doctype html>
<html>

<head>
  <script src="http://code.jquery.com/jquery-3.1.0.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.3/js.cookie.js"></script>
  <script src="/scripts/csrf.js"></script>
</head>

<body>
  <h1>CSRF Protection Demo</h1>
  <p>This page demonstrates usage of the
    <a href="https://github.com/electrode-io/electrode-csrf-jwt">electrode-csrf-jwt</a>
    module. Two endpoints are declared in <code>app.js</code>:
    <ul>
      <li>a GET endpoint, <code>/1</code>, to which the module automatically adds a csrf token header</li>
      <li>a POST endpoint, <code>/2</code>, to which the module automatically ensures the presence of a valid token in the request
        headers</li>
    </ul>
  </p>
  <p>Two simple tests via AJAX (JavaScript must be enabled) are demonstrated below:</p>
  <ul>
    <li><a id="test-valid-link" href="#">Test Valid POST</a> using a token retrieved from <code>/1</code> first (should succeed
      with status 200)</li>
    <li><a id="test-invalid-link" href="#">Test Invalid POST</a> using a forged token (should fail with status 500)</li>
  </ul>
  <div id="test-results"></div>
</body>

</html>
```

- Update `server.js` with the following:

```
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

### Run
- Start the hapijs app in `development` environment:

```
NODE_ENV=development npm start
```

- Navigate to `http://localhost:4000/csrf.html` to test the CSRF features

Built with :heart: by [Team Electrode](https://github.com/orgs/electrode-io/people) @WalmartLabs.

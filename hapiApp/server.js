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
const config = require("electrode-confippet").config;
const csrfPlugin = require("electrode-csrf-jwt").register;

server.connection(config.connection);

server.register({
  register: csrfPlugin,
  options: config.csrf.options
}, (error) => {
  if (error) {
    throw error;
  }
});

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

server.start((error) => {
  if (error) {
    throw error;
  }
  console.log(`hapijs server running @ ${server.info.uri}`);
});

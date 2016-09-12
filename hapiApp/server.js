'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();
const config = require("electrode-confippet").config;
const csrfPlugin = require("electrode-csrf-jwt").register;

server.connection(config.connection);

server.register({ 
        register: csrfPlugin, 
        options: config.csrf.options 
    }, 
    (error) => {
        if (error) {
            throw error;
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

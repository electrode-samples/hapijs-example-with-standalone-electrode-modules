'use strict';

const Lab = require('lab');
const Code = require('code');
const config = require('electrode-confippet').config;

console.log('.love> ' + JSON.stringify(config));

const lab = exports.lab = Lab.script();

lab.experiment('Config', () => {

    lab.test('it gets config data', (done) => {

        Code.expect(config).to.be.an.object();
        done();
    });


    lab.test('it gets config meta data', (done) => {

        Code.expect(config.$('$meta')).to.match(/this file configures the plot device/i);
        done();
    });
});

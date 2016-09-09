'use strict';

const Confidence = require('confidence');

const config = require("electrode-confippet").config;

const criteria = {
    env: process.env.NODE_ENV
};
const store = new Confidence.Store(config);

exports.get = function (key) {

    return store.get(key, criteria);
};

exports.meta = function (key) {

    return store.meta(key, criteria);
};

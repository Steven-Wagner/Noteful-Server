const {expect} = require('chai');
const request = require('supertest');
const setTZ = require('set-tz');
setTZ('UTC');

global.expect = expect;
global.request = request;
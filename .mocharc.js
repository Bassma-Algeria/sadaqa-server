'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');

require('ts-node/register');
require('dotenv').config({ path: './.env.test' });

chai.use(chaiHttp);
chai.use(chaiAsPromised);

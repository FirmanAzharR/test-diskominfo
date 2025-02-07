const fs        = require('fs');
const path      = require('path');
let helper      = {};
const ENV       = process.env.ENV;

module.exports = (helperName) => {
    if (ENV == 'TEST') {
        helper = require(`./${helperName}.test`);
    }
    else {
        helper =  require(`./${helperName}`);
    }
    return helper;
};
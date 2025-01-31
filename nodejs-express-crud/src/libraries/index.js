const fs        = require('fs');
const path      = require('path');
let library      = {};
const ENV       = process.env.ENV;

module.exports = (libraryName) => {
    if (ENV == 'TEST') {
        library = require(`./${libraryName}.test`);
    }
    else {
        library =  require(`./${libraryName}`);
    }
    return library;
};
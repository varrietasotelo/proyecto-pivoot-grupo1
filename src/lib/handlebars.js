const {format} = require('timeago.js');

const helpers = {};

//lo mas probable es qu eno usemos timestamp 
//format lo convierte a otro formato 
helpers.timeago = () => {
    return format(timestamp);
};

module.exports = helpers;
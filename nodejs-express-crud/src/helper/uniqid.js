// const moment    = require('moment-timezone');
// const Hashids   = require('hashids');
//                   moment.tz.setDefault('Asia/Jakarta');
// const otp       = require('otp-generator');
// const {
//     redisGet,
//     redisSet,
//     redisInc
// } = require('./')('redis');
// const bigNumber = require('big-number');

// const generateID = async (key, prefix = '', suffix = '') => {
//     let sequence;
//     let maxInteger  = bigNumber(process.env.REDIS_MAX_INTEGER);
//     let max         = 999;
//     let current     = maxInteger.minus(max);

//     try {
//         sequence = await redisGet(key);

//         if (sequence == null) {
//             sequence = 1;

//             await redisSet(key, current.add(1).toString());
//         }
//         else {
//             sequence = bigNumber(sequence);
//             sequence = sequence.minus(current);
//         }

//         let statusInc = await redisInc(key);

//         if (!statusInc) {
//             sequence = 1;
//             await redisSet(key, current.add(1).toString());
//             await redisInc(key);
//         }

//     }
//     catch (err) {
//         console.log(err);
//     }

//     let date                = moment();
//     let hours               = date.hours() +1;
//     let minutes             = date.minutes() +1;
//     let seconds             = date.seconds() +1;
//     let year                = date.format('YY');
//     let baseYear            = 21 // 2021
//     let daysOfYear          = date.dayOfYear();
//     let secondsOfCentury    = (((parseInt(year)-baseYear)-1) * 366 * 24 * 60 * 60) + ((daysOfYear-1) * 24 * 60 * 60) + (hours * 60 * 60 ) + (minutes * 60) + seconds;
//     let baseID              = secondsOfCentury.toString().padEnd(9,'0');
//     let id                  = baseID + sequence.toString().padStart(3,'0');

//     return prefix+id+suffix;
// }

// const generateCode = (id) => {
//     let hashids = new Hashids(process.env.BOOKING_CODE_ENCODE_TEXT, parseInt(process.env.BOOKING_CODE_MIN_LENGTH), process.env.BOOKING_CODE_CHAR);
//     let code = hashids.encode(id);
//     return code;
// }

// const genOTPCode = (length) => {
//     try {
//         let options = { upperCase: false, specialChars: false, lowerCaseAlphabets: false , upperCaseAlphabets: false, digits: true };
//         let activationCode = otp.generate(length, options);

//         return activationCode;
//     }
//     catch (err) {
//         console.log('genOTPCode', err);
//         return false;
//     }
// }

// module.exports = {genOTPCode, generateID, generateCode}

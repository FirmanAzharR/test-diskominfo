require('dotenv').config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cryptoOld = require("crypto");
const { sha1 } = require("sha1-hash-and-verify");
const moment = require("moment");
const rn = require("random-number");
const { AuthorizationError, ApplicationError } = require("./errorHandler");
// const { ticketModel } = require("../modules/ticket/models");
const crypto = require("crypto-js");

require("dotenv").config;

const genSha1 = (plainText) => {
  try {
    const hashedData = sha1(plainText);
    return hashedData;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const randomNumber = () => {
  let rand = rn.generator({
    min: 10000,
    max: 99999,
    integer: true,
  });

  return rand(1000);
};

const decSha1 = (hashedString) => {
  try {
    const hashedData = sha1(hashedString);
    const match = verifyHash("password", hashedData);
    return match;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const genSecretKey = () => {
  try {
    const hash = cryptoOld.randomBytes(32).toString("hex");
    return hash;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const genBcrypt = async (plainText, saltLength) => {
  try {
    const salt = bcrypt.genSaltSync(saltLength);
    const hashEncrypt = bcrypt.hashSync(plainText, salt);
    return hashEncrypt;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const compareBcrypt = async (plainText, encryptText) => {
  try {
    const compare = bcrypt.compareSync(plainText, encryptText);
    return compare;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const genJwt = (payload, expiresIn) => {
  try {
    let secret = process.env.SECRET_KEY;
    let token = jwt.sign(payload, secret, { expiresIn: expiresIn });
    return token;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const verifyJwt = async (req, res, next) => {
  let secret = process.env.SECRET_KEY;
  let authorization = req.headers.authorization;
  if (!authorization) {
    next(new AuthorizationError("Unauthorized, Please login first", 401));
  } else {
    let token = authorization.split(" ")[1];
    try {
      jwt.verify(token, secret, (err, res) => {
        // console.log(res)
        req.decodeToken = res;
      });
      next();
    } catch (err) {
      next(new AuthorizationError("Token Invalid or Expired", 403));
    }
  }
};

const verifyShift = async (req, res, next) => {
  console.log("middleware time");
  let open = req.decodeToken.open_shift;
  let close = req.decodeToken.close_shift;
  let openShift = moment(open, "HH:mma");
  let closeShift = moment(close.close_shift, "HH:mma");
  let getTime = moment().format("HH:mma");
  let currentTime = moment(getTime, "HH:mma");
  if (currentTime.isBetween(openShift, closeShift) === false) {
    return next(
      new ApplicationError(
        `your shift start at :${openShift}, end at :${closeShift} `
      )
    );
  } else {
    next();
  }
};

const verifyValidator = async (req, res, next) => {
  if (req.jwt_payload.role !== 9) {
    return next(new ApplicationError("this role cant access urls", 401));
  } else {
    next();
  }
};

const verifyTicketSales = async (req, res, next) => {
  if (req.jwt_payload.role !== 8) {
    return next(new ApplicationError("this role cant access urls", 401));
  } else {
    next();
  }
};

// const generateCode = async (initial) => {
//   try {
//     let yearNow = moment().year();
//     let now = moment().format("YYYY-MM-DD h:m:s");

//     let baseTime = moment(`${yearNow}-01-01 00:00:00`, "YYYY-MM-DD h:m:s");
//     let dateNow = moment(now, "YYYY-MM-DD h:m:s");
//     let substrac = dateNow.diff(baseTime);

//     let dateString = substrac.toString();
//     const baseNumber = dateString.padStart(9, "0");

//     let getSeq = await ticketModel.getSequence(
//       "transaction.t_trx_ticket_id_seq_seq"
//     );

//     const random = getSeq.padStart(3, "0");

//     let ticketCode = `${initial}${baseNumber}${random}`;

//     return ticketCode;
//   } catch (e) {
//     console.log(e);
//     return false;
//   }
// };

const encryptAes = (plainText, urlSafe = false) => {
  try {
    const aesKey = process.env.AES_KEY
    const aesIV = process.env.AES_IV

    const key = crypto.enc.Utf8.parse(aesKey);
    const iv = crypto.enc.Utf8.parse(aesIV);

    let chiperText = crypto.AES.encrypt(plainText, key, { iv: iv });
    let base64 = chiperText.toString();

    if (urlSafe) {
      base64 = base64.replace(/\+/g, "-");
      base64 = base64.replace(/\//g, "_");
    }

    return base64;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const decryptAes = (chiperText, urlSafe = false) => {
  try {
    const aesKey = process.env.AES_KEY
    const aesIV = process.env.AES_IV

    const key = crypto.enc.Utf8.parse(aesKey);
    const iv = crypto.enc.Utf8.parse(aesIV);

    if (urlSafe) {
      chiperText = chiperText.replace(/\-/g, "+");
      chiperText = chiperText.replace(/\_/g, "/");
    }

    let plainText = crypto.AES.decrypt(chiperText, key, { iv: iv });
    return plainText.toString(crypto.enc.Utf8);
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  genBcrypt,
  compareBcrypt,
  genJwt,
  verifyJwt,
  verifyShift,
  genSha1,
  genSecretKey,
  decSha1,
  verifyValidator,
  verifyTicketSales,
  // generateCode,
  randomNumber,
  encryptAes,
  decryptAes,
};


const moment = require('moment');
const CryptoJS = require('crypto-js');

const authorizeRemoteAPI = (url) => {
    const secret = CryptoJS.enc.Base64.parse(process.env.API_KEY);
    const date = `${moment.utc().format('ddd, DD MMM YYYY HH:mm:ss')} GMT`;

    const generateNonce = (length) => {
        let text = "";
        const possible = "0123456789";
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    const endpoint = url.split('/').slice(0, 3).join('/');
    const route = url.slice(endpoint.length);
    const nonce = generateNonce(9);
    const message = `${route}\r\n${nonce}\r\n${date}\r\n`;
    const hash = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(message, secret));

    // console.log(date, `${nonce}:${hash}`)

    return { Authorization: `${nonce}:${hash}`, Date: date }
};

module.exports = authorizeRemoteAPI;
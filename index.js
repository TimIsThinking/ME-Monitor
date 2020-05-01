require('dotenv').config()
const winsc = require('winsc');
const fetch = require('node-fetch');
const authorizeRemoteAPI = require('./src/utils/authorizeRemoteAPI');

const serviceName = process.env.SERVICE_NAME;
// const timedRestart = true;
let checkCount = 0;
let timer = 360;
let timeToRestart = 360;

const wait = async ms => {
    setTimeout(() => { }, ms)
};

const sendMessage = async () => {

    const url = `${process.env.REMOTE_API_URL}/session/gamechat`;
    const { Authorization, Date } = authorizeRemoteAPI(url);

    const options = {
        method: 'POST',
        headers: {
            Accept: 'appplication/json',
            Authorization,
            Date
        },
        body: JSON.stringify({
            RecipientIdentityId: null,
            Message: "This is a test message from node monitor"
        })
    };

    const response = await fetch(url, options);
    console.log('response', response.status);
};

const timerCheck = async () => {
    let status = await winsc.status(serviceName);

    if (status === "STOPPED") {
        main();
        checkCount = 0;
    }

    if (checkCount > timer) {
        console.log('Attempting to restart service...');
        sendMessage();
        let stop = await winsc.stop(serviceName);
        console.log('stop', stop);
        checkCount = 0;
        timeToRestart = timer;
        await wait(60000);
        main();
    }

    console.log(checkCount);
    checkCount++;
};

const main = async () => {
    let doesExists = await winsc.exists(serviceName);

    if (doesExists) {
        let status = await winsc.status(serviceName);
        console.log('status', status);
        if (status === "STOPPED") {
            let start = await winsc.start(serviceName);
            console.log('start', start);
        } else {
            console.log('Service not stopped!');
        }
    } else {
        console.log('Service does not exist!');
    }
};

// main();

timerCheck();
setInterval(timerCheck, 60000);

// sendMessage();
require('dotenv').config()
const winsc = require('winsc');
const fetch = require('node-fetch');
const wait = require('./src/utils/wait');
const authorizeRemoteAPI = require('./src/utils/authorizeRemoteAPI');
const sendDiscordMessage = require('./src/utils/discordWebhook');

const serviceName = process.env.SERVICE_NAME;
let checkCount = 0;
const timer = 360;
const minute = 60000;

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
            Message: "Server restarting..."
        })
    };

    try {
        const response = await fetch(url, options);
        if (response.status !== 204) {
            console.log('Failed to send server message');
        }
    } catch (e) {
        console.log('Failed to send server message: ', e);
    }

    try {
        sendDiscordMessage();
    } catch (e) {
        console.log('Failed to send discord message: ', e);
    }
};

const timerCheck = async () => {
    console.clear();
    let status = await winsc.status(serviceName);

    if (status === "STOPPED") {
        main();
        checkCount = 0;
    } else if (checkCount >= timer) {
        console.log('Attempting to restart service...');
        const stop = await winsc.stop(serviceName);
        console.log('stop', stop);
        checkCount = 0;
        main();
    } else if (checkCount === timer - 1) {
        sendMessage();
    }

    console.log(`Server has been up for ${checkCount} minutes, next restart in ${timer - checkCount} minutes`);
    checkCount++;
};

const main = async () => {
    await wait(minute);
    const doesExists = await winsc.exists(serviceName);

    if (doesExists) {
        const status = await winsc.status(serviceName);
        console.log('status', status);
        if (status === "STOPPED") {
            const start = await winsc.start(serviceName);
            start && console.log('Server is starting...');
        } else {
            console.log('Service not stopped!');
        }
    } else {
        console.log('Service does not exist!');
    }
};

timerCheck();
setInterval(timerCheck, minute);

console.log('Started ME Monitor');
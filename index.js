require('dotenv').config()
const winsc = require('winsc');
const fetch = require('node-fetch');
const wait = require('./src/utils/wait');
const authorizeRemoteAPI = require('./src/utils/authorizeRemoteAPI');
const sendDiscordMessage = require('./src/utils/discordWebhook');

const serviceName = process.env.SERVICE_NAME;
let checkCount = 0;
let timer = 360;

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
        if (response.status === 204) {
            console.log('Sent server message');
        } else {
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
    let status = await winsc.status(serviceName);

    if (status === "STOPPED") {
        main();
        checkCount = 0;
    }

    if (checkCount > timer - 1) {
        sendMessage();
    }

    if (checkCount > timer) {
        console.log('Attempting to restart service...');
        let stop = await winsc.stop(serviceName);
        console.log('stop', stop);
        checkCount = 0;
        await wait(60000);
        main();
    }

    console.log(`Server has been up for ${checkCount} minutes, next restart in ${timer - checkCount} minutes`);
    checkCount++;
};

const main = async () => {
    const doesExists = await winsc.exists(serviceName);

    if (doesExists) {
        const status = await winsc.status(serviceName);
        console.log('status', status);
        if (status === "STOPPED") {
            const start = await winsc.start(serviceName);
            console.log('start', start);
        } else {
            console.log('Service not stopped!');
        }
    } else {
        console.log('Service does not exist!');
    }
};

setInterval(timerCheck, 60000);
const Discord = require('discord.js');

const webhookClient = new Discord.WebhookClient(process.env.DISCORD_WEBHOOK_ID, process.env.DISCORD_WEBHOOK_TOKEN);

const embed = new Discord.MessageEmbed()
    .setTitle('Server restarting...')
    .setColor('#0099ff');

const sendMessage = () => {
    webhookClient.send({
        // username: 'some-username',
        // avatarURL: 'https://i.imgur.com/wSTFkRM.png',
        embeds: [embed],
    })
};

module.exports = sendMessage;
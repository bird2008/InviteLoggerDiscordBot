require('dotenv').config();


const { Client, Collection, Message, MessageEmbed } = require('discord.js');
const chalk = require('chalk');
const colors = require('hexacolors');

const client = new Client();
client.commands = new Collection();
client.aliases = new Collection();
client.config = require('../config');
client.emotes = new Collection();

try {
    client.login(process.env.token);
} catch {
    console.log(
        chalk.red("[!] Nie można połączyć się z Discordem. Sprawdź, czy podany token jest ważny!")
    );
};

//? HANDLER
["commands"].forEach(handler => {
    require(`./handler/${handler}`)(client);
});

//? EVENTS
["ready", "disconnect", "message", "guildMemberAdd", "guildMemberRemove"].forEach(event => {
    client.on(event, (x, y) => require(`./events/${event}`)(client, x, y));
});

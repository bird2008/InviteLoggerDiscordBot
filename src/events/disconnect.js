const { Client, Collection, MessageEmbed, WebhookClient } = require('discord.js');
const chalk = require('chalk');
const db = require('quick.db');
const colors = require('hexacolors');
/**
 * @param {Client} client 
 * @param {any} x
 * @param {number} y
 */
module.exports = async (client, x, y) => {
    console.log(
        chalk.red(`[!] Rozłączono z Discordem !`)
    );
};
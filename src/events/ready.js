const { Client, Collection, MessageEmbed, WebhookClient } = require('discord.js');
const chalk = require('chalk');
const db = require('quick.db');
const colors = require('hexacolors');
const { toRemaining, fromIntToLocalDate } = require('versus-tools');
/**
 * @param {Client} client 
 */
module.exports = async (client) => {
    console.log(
        chalk.green(`[+] Połączony z Discordem jako ${client.user.tag} (ID: ${client.user.id})`)
    );
    client.guilds.cache.forEach(async (guild) => {
        if(!db.has(`guilds.${guild.id}`)) {
            db.set(`guilds.${guild.id}`, {
                prefix: client.config.defaultPrefix,
                moderators: [],
                ranks: [],
                welcomeMessage: "{memberMention} został zaproszony przez **{inviterTag}** który ma teraz **{inviteCount}** zaproszeń.",
                welcomeChannelID: guild.channels.cache.filter(c => c.type == "text").random().id,
                logsChannel: false,
                commandsChannelsID: false,
                ignoredChannels: []
            });
        };
        try {
            (await guild.fetchInvites()).forEach(async (invite) => {
                if(invite.code == guild.vanityURLCode) {
                    db.set(`guildInvites.${guild.id}.vanity`, invite.uses);
                } else db.set(`guildInvites.${guild.id}.${invite.code}`, invite.uses);
            });
        } catch {};
    });
};
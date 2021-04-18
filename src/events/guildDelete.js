const { Client, Guild, WebhookClient, MessageEmbed } = require('discord.js');
const colors = require('hexacolors');
const moment = require('moment');
const { toRemaining } = require('versus-tools');

/**
 * @param {Client} client 
 * @param {Guild} guild 
 */
module.exports = async (client, guild) => {
    
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
};
const { Client, Message, MessageEmbed } = require('discord.js');
const db = require('quick.db');
const colors = require('hexacolors');

/**
 * @param {Client} client 
 * @param {Message} msg 
 * @param {Array<string>} args 
 */
const run = async (client, msg, args) => {

    client.sendError = (message, msg) => {
        let embed = new MessageEmbed()
            .setColor(colors.red)
            .setDescription(`❌ ***${message}***`)
        return msg.channel.send(embed).catch(()=>{});
    };

    client.sendDone = (message, msg) => {
        let embed = new MessageEmbed()
            .setColor(colors.green)
            .setDescription(`✅ ***${message}***`)
        return msg.channel.send(embed).catch(()=>{});
    };

    if(!args[0]) {
        db.set(`guilds.${msg.guild.id}.welcomeChannelID`, false);
        client.sendDone(`Wiadomości z zaproszeniami nie będą już wysyłane.`, msg);
    } else {
        const channel = msg.mentions.channels.first() || msg.guild.channels.cache.get(args[0]) || msg.guild.channels.cache.find(c => c.name.includes(args.join(" ")));
        if(!channel || channel.type !== "text") return client.sendError("Żaden kanał tekstowy nie odpowiada podanym informacjom.", msg);
        db.set(`guilds.${msg.guild.id}.welcomeChannelID`, channel.id);
        client.sendDone(`Zaproszenia zostaną wysłane na kanału ${channel.toString()}.`, msg);
    };
};
module.exports = {
    name: "config welcomeChannel",
    category: "config",
    description: "Umożliwia skonfigurowanie kanału, w którym będą wysyłane wiadomości z zaproszeniami (jeśli nie zostanie określony kanał, bot nie wyśle ​​wiadomości. Można je edytować w dowolnym momencie).",
    usage: "``[#channel | channelID]``",
    aliases: ["welcomeChannel", "wlc"],
    permissions: ["MANAGE_CHANNELS"],
    run: run
};
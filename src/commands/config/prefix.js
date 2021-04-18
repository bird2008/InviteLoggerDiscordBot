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

    if(!msg.member.hasPermission("MANAGE_GUILD")) return client.sendError("Nie masz uprawnień do używania tego polecenia.", msg);
    const prefix = args[0]
    if(!prefix) return client.sendError("Musisz podać nową wartość prefixu!", msg);

    db.set(`guilds.${msg.guild.id}.prefix`, prefix);
    client.sendDone(`Nowy prefix to teraz \`\`${prefix}\`\``, msg);

};

module.exports = {
    name: "config prefix",
    category: "config",
    description: "Umożliwia skonfigurowanie prefiksu serwera.",
    usage: "``<nowy prefix>``",
    aliases: ["prefix"],
    permissions: ["MANAGE_GUILD"],
    run: run
};
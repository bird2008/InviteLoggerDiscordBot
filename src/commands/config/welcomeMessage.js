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
    const message = args.join(" ");
    if(!message) return client.sendError("Musisz podać wiadomość, która zostanie wysłana, gdy członek dołączy do serwera.", msg);
    db.set(`guilds.${msg.guild.id}.welcomeMessage`, message);
    client.sendDone(`Wiadomość o przybyciu została zmodyfikowana.`, msg);
};

let variables = [
    "{inviterMention}", "{inviterTag}", "{inviterUsername}", "{inviterID}", "{inviteCount}",
    "{memberMention}", "{memberTag}", "{memberUsername}", "{memberID}", "{memberCreatedAt}"
];
module.exports = {
    name: "config welcomeMessage",
    category: "config",
    description: `Umożliwia skonfigurowanie wiadomości powitalnej.\n__**Dostępne zmienne:**__\n${variables.map(v => `\`\`${v}\`\``).join(", ")}`,
    usage: "``<message>``",
    aliases: ["welcomeMessage", "msg"],
    permissions: ["MANAGE_GUILD"],
    run: run
};
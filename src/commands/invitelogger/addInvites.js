const { Client, Message, MessageEmbed } = require('discord.js');
const db = require('quick.db');
const colors = require('hexacolors');

/**
 * @param {Client} client 
 * @param {Message} msg 
 * @param {Array<string>} args 
 */
const run = async (client, msg, args) => {
    const guild = db.get(`guilds.${msg.guild.id}`);
    let moderator = false;
    guild.moderators.forEach(m => {
        if(m == msg.author.id || msg.member.roles.cache.map(r => r.id == m)) moderator = true;
    });
    if(!moderator && !msg.member.hasPermission("MANAGE_GUILD")) return client.sendError("Nie masz uprawnień do używania tego polecenia!", msg);
    
    const member = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);
    if(!member) return client.sendError("Żaden członek nie jest zgodny z podanymi informacjami.", msg);
    let amount = parseInt(args[1]);
    if(!amount || isNaN(amount) || amount <= 0) amount = 1;
    if(!db.has(`userInvites.${msg.guild.id}.${member.user.id}`)) {
        db.set(`userInvites.${msg.guild.id}.${member.user.id}`, {
            count: {
                ordinaries: 0,
                bonus: 0,
                fakes: 0,
                leaves: 0,
                total: 0,
                reloaded: {
                    ordinaries: 0,
                    bonus: 0,
                    fakes: 0,
                    leaves: 0,
                    total: 0,
                }
            },
            joined: [{
                fake: false,
                by: false,
                at: member.joinedAt,
                inviteCode: false
            }]
        });
    };
    db.add(`userInvites.${msg.guild.id}.${member.user.id}.count.bonus`, amount);
    db.add(`userInvites.${msg.guild.id}.${member.user.id}.count.total`, amount);
    client.sendDone(`\`\`${amount}\`\` dodatkowe zaproszenia zostały dodane do ${member.user.toString()}.`, msg);
};
module.exports = {
    name: "addInvites",
    category: "invitelogger",
    description: "Dodaje zaproszenia do członka serwera (jeśli nie podano kwoty lub jeśli kwota jest mniejsza niż 1, kwota jest automatycznie ustawiana na 1).",
    usage: "``<@member | memberID>`` ``[montant]``",
    aliases: ["addi"],
    permissions: ["MANAGE_GUILD"],
    run: run
};
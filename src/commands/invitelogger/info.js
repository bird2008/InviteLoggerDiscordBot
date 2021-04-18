const { Client, Message, MessageEmbed } = require('discord.js');
const db = require('quick.db');
const colors = require('hexacolors');
const { fromIntToLocalDate } = require('versus-tools');

/**
 * @param {Client} client 
 * @param {Message} msg 
 * @param {Array<string>} args 
 */
const run = async (client, msg, args) => {
    const member = args[0] ? msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) : msg.member;
    if(!member) return client.sendError("Aucun membre ne correspond aux informations donnée.", msg);

    if(!db.has(`userInvites.${member.guild.id}.${member.user.id}`)) {
        db.set(`userInvites.${member.guild.id}.${member.user.id}`, {
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

    const user = db.get(`userInvites.${member.guild.id}.${member.user.id}`);

    let invitedBy = client.users.cache.get(user.joined[user.joined.length-1].by);
    let lastJoins = Object.entries(db.get(`userInvites.${member.guild.id}`))
        .filter(u => u[1].joined[u[1].joined.length-1] && u[1].joined[u[1].joined.length-1].by == member.user.id)
    if(lastJoins) lastJoins.sort((a, b) => a[1].joined[a[1].joined.length-1].at.getTime() - b[1].joined[b[1].joined.length-1].at.getTime());

    let joinedTimes = user.joined.length;
    let createdTimestamp = fromIntToLocalDate(Date.now() - member.user.createdTimestamp);
    let invites = `**${user.count.total}** (**${user.count.ordinaries}** normalne, **${user.count.bonus}** bonusowe, **${user.count.fakes}** fejkowe, **${user.count.leaves}** opóściło)`;
    let clearedInvites = `**${user.count.reloaded.total}** (**${user.count.reloaded.ordinaries}** normalne, **${user.count.reloaded.bonus}** bonusowe)`;
    let invitesActivity = (await msg.guild.fetchInvites())
        .filter(i => i.inviter && i.inviter.id == member.user.id)
        .sort((a, b) => b.createdTimestamp - a.createdTimestamp)
        .array()
        .slice(0, 7)
        .map(invite => {
            return `**${invite.uses}** używa - **${invite.code}** - Stworzony  **${fromIntToLocalDate(Date.now() - invite.createdTimestamp)}**`
        }).join("\n");
    let invitedMembers = Object.entries(db.get(`userInvites.${member.guild.id}`))
        .filter(e => e[1].joined[e[1].joined.length-1] && e[1].joined[e[1].joined.length-1].by == member.user.id && client.users.cache.get(e[0]))
        .sort((a, b) => a[1].joined[a[1].joined.length-1].at.getTime() - b[1].joined[b[1].joined.length-1].at.getTime())
        .slice(0, 7)
        .map(entry => {
            let joined = entry[1].joined[entry[1].joined.length-1];
            let userEntry = client.users.cache.get(entry[0]);
            let invitedInvite = joined.inviteCode;
            let timestamp = fromIntToLocalDate(Date.now() - member.joinedAt.getTime());
            return `${userEntry.toString()} avec ${invitedInvite ? `**${invitedInvite}**` : "***Inconnue***"} - Il y a ${timestamp ? `**${timestamp}**` : "***...***"}`
        }).join("\n");
    let embed = new MessageEmbed()
        .setColor(client.config.embedColors)
        .setAuthor(member.user.username, member.user.displayAvatarURL())
        .setFooter(msg.author.username, msg.author.displayAvatarURL())
        .setTimestamp()
        .addField(
            "Zaproszony przez",
            invitedBy ? invitedBy.toString() : `❌ ***Nieznany***`,
            true
        ).addField(
            "Dołączył",
            joinedTimes + ' razy',
            true
        ).addField(
            "Konto aktywne przez",
            createdTimestamp
        ).addField(
            "Zaproszenia",
            invites,
            true
        ).addField(
            "Usunięte zaproszenia",
            clearedInvites,
            true
        ).addField(
            "Regularne zaproszenia",
            invitesActivity ? invitesActivity : `❌ ***Bez zaproszenia***`
        ).addField(
            "Zaproszeni członkowie",
            invitedMembers ? invitedMembers : `❌ ***Brak zaproszonych członków***`
        )
    msg.channel.send(embed);
};

module.exports = {
    name: "info",
    category: "invitelogger",
    description: "Wysyła informacje twoje lub członka.",
    usage: "``[@member | memberID]``",
    permissions: ["MANAGE_GUILD"],
    aliases: ["info"],
    run: run
};
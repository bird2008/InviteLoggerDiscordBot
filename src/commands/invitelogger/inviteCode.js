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
    try {
        const invites = (await msg.guild.fetchInvites())
            .filter(i => i.inviter && i.inviter.id == msg.author.id)
            .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
            .array()
        let embed = new MessageEmbed()
            .setColor(client.config.embedColors)
            .setAuthor(`Twoje zaproszenia na serwerze ${msg.guild.name}`, msg.guild.iconURL())
        let pages = [];
        let p = [];
        for (let i = 0; i < invites.length; i++) {
            p.push(invites[i]);
            if(p.length == 5) {
                pages.push(p);
                p = [];
            };
        }; if(p.length > 0) pages.push(p);

        let reactions = ["⬅️", "➡️"];

        embed.setDescription(`🤍 ***W trakcie...***`)
        
        try {
            const message = await msg.author.send(embed);
            for (let reaction of reactions) {
                await message.react(reaction);
            };
            
            let page = 0;
            let loop = true;
            while (loop) {
                embed.fields = []
                embed
                    .setFooter(`Page ${page+1}/${pages.length}`)
                    .setDescription(
                        pages[page].map(invite => {
                            embed.addField(
                                invite.code,
                                `**Używa**: ${invite.uses}\n` +
                                `**Termin upływa**: ${invite.expiresTimestamp > 0 ? fromIntToLocalDate(invite.expiresTimestamp - Date.now()) : "∞"}\n` +
                                `**Maksymalne zastosowania**: ${invite.maxUses == 0 ? "∞" : invite.maxUses}\n` +
                                `**Kanał**: ${invite.channel ? invite.channel.toString() : `${client.emotes.get("no").toString()}`}`
                            )
                        })
                    )
                await message.edit(embed);
                let filter = (reaction, user) => {
                    return reactions.includes(reaction.emoji.name) && user.id == msg.author.id;
                };
                await message.awaitReactions(filter, { max: 1, time: 60000, errors: ["czas"] }).then(async (collected) => {
                    let reaction = collected.first();
                    if(reaction.emoji.name == "⬅️" && page > 0) page--;
                    else if(reaction.emoji.name == "➡️" && page < pages.length-1) page++;
                }).catch(() => {
                    message.delete();
                    return loop = false;
                });
                
                const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(msg.author.id));
                try {
                    for (const reaction of userReactions.values()) {
                        await reaction.users.remove(msg.author.id);
                    }
                } catch {};
            };
        } catch {
            return client.sendError("Nie mogłem wysłać ci wiadomości. Odblokuj swoje prywatne wiadomości i spróbuj ponownie.", msg).catch(()=>{});
        };
    } catch (err) { console.error(err); };
};

module.exports = {
    name: "inviteCode",
    category: "invitelogger",
    description: "Wysyła podsumowanie Twoich regularnych zaproszeń w wiadomościach prywatnych.",
    aliases: ["ic"],
    run: run
};
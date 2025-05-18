const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("discord.js");
const dbPath = path.join(__dirname, "../db/db.json");

module.exports = {
    name: "guildMemberAdd",
    async execute(client, member) {
        if (member.user.bot) return;

        let data;
        try {
            data = JSON.parse(fs.readFileSync(dbPath, "utf8"));
        } catch {
            data = {};
        }

        if (!Array.isArray(data.blacklist) || !data.blacklist.includes(member.id)) return;

        try {
            await member.ban({ reason: "blacklist" });
        } catch {}

        if (client.config.logs) {
            const channel = member.guild.channels.cache.get(client.config.logs);
            if (channel) {
                const embed = new EmbedBuilder()
                    .setColor(0xff0000)
                    .setTitle("Membre blacklist qui tente de rejoindre")
                    .setDescription(`L'utilisateur <@${member.id}> | \`${member.id}\` a été banni car il a essayé de rejoindre alors qu'il est blacklist.`)
                    .setTimestamp();

                channel.send({ embeds: [embed] }).catch(() => {});
            }
        }
    }
};


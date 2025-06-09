const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const dbPath = path.join(__dirname, "../db/db.json");
const config = require("../config");

module.exports = {
    name: "unbl",
    description: "Retire un utilisateur de la blacklist",
    aliases: [],
    permissions: [],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    botOwner: true,
    wlOnly: false,
    async executeSlash(client, interaction) {
        await interaction.deferReply({ ephemeral: true });
        const user = interaction.options.getUser("user");
        if (!user) return interaction.editReply("Veuillez spécifier un utilisateur.");

        let data = {};
        try { data = JSON.parse(fs.readFileSync(dbPath, "utf8")); } catch {}
        if (!Array.isArray(data.blacklist)) data.blacklist = [];
        data.auteur = data.auteur || {};

        if (!data.blacklist.includes(user.id)) {
            return interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setColor(0xff0000)
                    .setDescription(`<:990not:1371830095391756379>・<@${user.id}> n'est pas blacklist.`)
                ]
            });
        }

        if (data.auteur[user.id] !== interaction.user.id) {
            if (config.logs) {
                const logChan = await client.channels.fetch(config.logs).catch(() => null);
                if (logChan?.isTextBased()) {
                    const failEmbed = new EmbedBuilder()
                        .setTitle("Tentative d'unblacklist")
                        .setColor(0xffa500)
                        .setDescription(`\`⚠️\`・<@${interaction.user.id}> a tenté de retirer ${user} | \`${user.id}\` de la blacklist alors qu'il n'est pas l'auteur du blacklist.`)
                        .setTimestamp();
                    logChan.send({ embeds: [failEmbed] }).catch(() => {});
                }
            }

            return interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setColor(0xff0000)
                    .setDescription(`<:990not:1371830095391756379>・Vous n'êtes pas l'auteur du blacklist de <@${user.id}>, vous ne pouvez pas le débannir.`)
                ]
            });
        }

        data.blacklist = data.blacklist.filter(id => id !== user.id);
        delete data.auteur[user.id];
        delete data.temps?.[user.id];

        try {
            fs.writeFileSync(dbPath, JSON.stringify(data, null, 4));
        } catch {
            return interaction.editReply("Erreur interne lors de la sauvegarde.");
        }

        const guild = interaction.guild;
        try {
            const bans = await guild.bans.fetch();
            if (bans.has(user.id)) {
                await guild.bans.remove(user.id, "Unbl effectué par l'auteur du bl");
            }
        } catch {}

        if (config.logs) {
            const logChan = await client.channels.fetch(config.logs).catch(() => null);
            if (logChan?.isTextBased()) {
                const logEmbed = new EmbedBuilder()
                    .setTitle("Retrait de blacklist")
                    .setColor(0x00ff00)
                    .setDescription(`<:990yyes:1371830093252399196>・${user} | \`${user.id}\` a été **retiré** de la blacklist et débanni par ${interaction.user} | \`${interaction.user.id}\`.`)
                    .setTimestamp();
                logChan.send({ embeds: [logEmbed] }).catch(() => {});
            }
        }

        return interaction.editReply({
            embeds: [new EmbedBuilder()
                .setColor(0x00ff00)
                .setDescription(`<:990yyes:1371830093252399196>・${user} | \`${user.id}\` a été retiré de la blacklist et débanni.`)
            ]
        });
    },

    data: new SlashCommandBuilder()
        .setName("unbl")
        .setDescription("Retire un utilisateur de la blacklist")
        .addUserOption(o => o.setName("user").setDescription("L'utilisateur à débannir").setRequired(true)),
};

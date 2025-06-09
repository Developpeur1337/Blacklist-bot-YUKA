const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const dbPath = path.join(__dirname, "../db/db.json");
const config = require("../config");

module.exports = {
    name: "bl",
    description: "Blacklist un utilisateur et le ban du serveur",
    aliases: [],
    permissions: [],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    botOwner: true,
    wlOnly: false,
    async executeSlash(client, interaction) {
        await interaction.deferReply({ ephemeral: true });
        const user = interaction.options.getUser("user");

        let data = {};
        try { data = JSON.parse(fs.readFileSync(dbPath, "utf8")); } catch {}
        if (!Array.isArray(data.blacklist)) data.blacklist = [];

        if (!user) {
            if (!data.blacklist.length) return interaction.editReply("La blacklist est vide.");
            return interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setTitle("Liste des utilisateurs blacklist")
                    .setDescription(data.blacklist.map((id,i) => `\`${i+1}\` - <@${id}> | \`${id}\``).join("\n"))
                    .setColor(0xff0000)
                ]
            });
        }

        if (data.blacklist.includes(user.id)) 
            return interaction.editReply({embeds:[new EmbedBuilder().setColor(0xff0000).setDescription(`<:990not:1371830095391756379>・<@${user.id}> est déjà blacklist.`)]});

        data.blacklist.push(user.id);
        data.auteur = data.auteur || {};
        data.auteur[user.id] = interaction.user.id;
        data.temps = data.temps || {};
        data.temps[user.id] = Date.now();

        try { fs.writeFileSync(dbPath, JSON.stringify(data, null, 4)); } 
        catch { return interaction.editReply("Erreur interne lors de la sauvegarde."); }

        const member = interaction.guild.members.cache.get(user.id);
        if (member) await member.ban({ reason: "Blacklist" }).catch(() => {});

        if (config.logs) {
            const logChan = await client.channels.fetch(config.logs).catch(() => null);
            if (logChan?.isTextBased()) {
                const logEmbed = new EmbedBuilder()
                    .setTitle("Utilisateur blacklist")
                    .setColor(0xff0000)
                    .setDescription(`\`🔨\`・${user} | \`${user.id}\` a été **blacklist** par ${interaction.user} | \`${interaction.user.id}\`.`)
                    .setTimestamp();
                logChan.send({ embeds: [logEmbed] }).catch(() => {});
            }
        }

        return interaction.editReply({embeds:[new EmbedBuilder().setColor(0x00ff00).setDescription(`<:990yyes:1371830093252399196>・<@${user.id}> est désormais **blacklist**.`)]});
    },

    data: new SlashCommandBuilder()
        .setName("bl")
        .setDescription("Blacklist un utilisateur")
        .addUserOption(o => o.setName("user").setDescription("L'utilisateur à blacklist").setRequired(false)),
};

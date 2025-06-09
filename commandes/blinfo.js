const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const dbPath = path.join(__dirname, "../db/db.json");

module.exports = {
    name: "blinfo",
    description: "Affiche les informations sur un utilisateur blacklisté",
    aliases: [],
    permissions: [],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    botOwner: true,
    wlOnly: false,
    async executeSlash(client, interaction) {
        await interaction.deferReply({ ephemeral: true });
        const user = interaction.options.getUser("user");
        if (!user) return interaction.editReply("❗ Veuillez spécifier un utilisateur.");

        let data = {};
        try { data = JSON.parse(fs.readFileSync(dbPath, "utf8")); } catch {}

        if (!Array.isArray(data.blacklist) || !data.blacklist.includes(user.id)) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#FF4C4C")
                        .setDescription(`❌ L'utilisateur **${user.tag}** n'est pas blacklisté.`)
                ]
            });
        }

        const auteurId = data.auteur?.[user.id] || null;
        const auteur = auteurId ? await client.users.fetch(auteurId).catch(() => null) : null;

        const timestamp = data.temps?.[user.id];
        let dateStr = "Date non disponible";
        let discordTimestamp = "";
        if (timestamp) {
            const dateObj = new Date(timestamp);
            dateStr = dateObj.toLocaleString("fr-FR", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
            discordTimestamp = `<t:${Math.floor(timestamp / 1000)}:R>`;
        }

        const embed = new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle(`\`🛑\`・Blacklist Info`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: "\`👤\`・Utilisateur", value: `${user}\n\`(${user.id})\``, inline: true },
                { name: "\`⭐\`・Auteur du blacklist", value: auteur ? `${auteur}\n\`(${auteur.id})\`` : `Inconnu\n\`${auteurId ?? "N/A"}\``, inline: true },
                { name: "\`⏰\`・Blacklisté depuis", value: `${dateStr}\n${discordTimestamp}`, inline: false }
            )
            .setFooter({ text: `Demandé par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        return interaction.editReply({ embeds: [embed] });
    },

    data: new SlashCommandBuilder()
        .setName("blinfo")
        .setDescription("Affiche les infos d'un utilisateur blacklisté")
        .addUserOption(option => option.setName("user").setDescription("L'utilisateur à vérifier").setRequired(true)),
};

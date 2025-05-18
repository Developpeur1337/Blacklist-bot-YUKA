const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const dbPath = path.join(__dirname, "../db/db.json");

module.exports = {
    name: "owner",
    description: "Attribuer le rôle d'owner à un utilisateur ou afficher les owners actuels",
    aliases: [],
    permissions: [],
    guildOwnerOnly: false,
    botOwnerOnly: true,
    botOwner: false,
    async executeSlash(client, interaction) {
        await interaction.deferReply({ ephemeral: true });
        const user = interaction.options.getUser("user");

        if (!client.perms) client.perms = {};
        if (!Array.isArray(client.perms.owners)) client.perms.owners = [];

        if (!user) {
            const ownersList = await Promise.all(
                client.perms.owners.map(async (id, i) => {
                    const member = await client.users.fetch(id).catch(() => null);
                    return `\`${i + 1}\` - ${member ? `<@${member.id}> | \`${member.id}\`` : "`Inconnu` | `ID non trouvé`"}`;
                })
            );

            const embed = new EmbedBuilder()
                .setTitle("\`📌\` 〃 Liste des owners")
                .setColor(0xFF0000)
                .setDescription(ownersList.length ? ownersList.join("\n") : "Aucun owner défini.");

            return interaction.editReply({ embeds: [embed] });
        }

        if (client.perms.owners.includes(user.id)) {
            const deja = new EmbedBuilder()
                .setColor(0xFF0000)
                .setDescription(`<:990not:1371830095391756379> 〃 <@${user.id}> est déjà owner`);

            return interaction.editReply({ embeds: [deja] });
        }

        client.perms.owners.push(user.id);

        fs.writeFileSync(dbPath, JSON.stringify(client.perms, null, 4));

        const embedOk = new EmbedBuilder()
            .setColor(0x00FF00)
            .setDescription(`<:990yyes:1371830093252399196> 〃 <@${user.id}> a été ajouté aux owners`);

        interaction.editReply({ embeds: [embedOk] });
    },

    data: new SlashCommandBuilder()
        .setName("owner")
        .setDescription("Ajouter un owner ou afficher la liste des owners")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Utilisateur à ajouter comme owner")
                .setRequired(false)
        ),
};

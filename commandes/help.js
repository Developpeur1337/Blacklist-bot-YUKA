const { SlashCommandBuilder, EmbedBuilder, chatInputApplicationCommandMention } = require("discord.js");

module.exports = {
    name: "help",
    description: "Affiche la page d'aide du bot",
    aliases: [],
    permissions: [],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    botOwner: true,
    async executeSlash(client, interaction) {
        const commande = await client.application.commands.fetch();

        const set = [
            { name: "bl", desc: "Blacklist un utilisateur" },
            { name: "unbl", desc: "Retire un utilisateur de la blacklist" },
            { name: "blinfo", desc: "Affiche les information d'un utilisateur blacklist" },
            { name: "owner", desc: "Ajoute & liste les owners" },
            { name: "unowner", desc: "Retire des owners" },
            { name: "help", desc: "Affiche cette page d'aide" },
            { name: "setlogs", desc: "Affiche ou définit le salon de logs" },
        ];

        const help = set
            .map(cmd => {
                const command = commande.find(c => c.name === cmd.name);
                return command
                    ? `* ${chatInputApplicationCommandMention(cmd.name, command.id)} \`-\` ${cmd.desc}`
                    : `* \`/${cmd.name}\` \`-\` ${cmd.desc} *(non trouvée)*`;
            })
            .join("\n");

        const embed = new EmbedBuilder()
            .setColor(0x2F3136)
            .setDescription([
                "**__Page d'aide__**",
                "",
                "<a:Fleche:1289675112559280140> **Commande slash :**",
                help
            ].join("\n"))
            .setImage("https://cdn.discordapp.com/attachments/1051238708734611506/1051238771045187665/barre.jpg");

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },

    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Affiche la page d'aide du bot")
};

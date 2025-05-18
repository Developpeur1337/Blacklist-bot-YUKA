const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const config = require("../config.json");

module.exports = {
    name: "setlogs",
    description: "Affiche ou définit le salon de logs.",
    aliases: [],
    permissions: [],
    guildOwnerOnly: false,
    botOwnerOnly: true,
    botOwner: false,
    async executeSlash(client, interaction) {
        const channel = interaction.options.getChannel("salon");

        if (!channel) {
            const logs = config.logs
                ? `<#${config.logs}> | \`${config.logs}\``
                : "`Aucun salon de logs défini.`";

            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setTitle("\`📝\`・Salon de logs actuel")
                    .setDescription(logs)
                    .setColor(0x2F3136)
                ],
                ephemeral: true
            });
        }

        config.logs = channel.id;
        fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));

        return interaction.reply({
            embeds: [new EmbedBuilder()
                .setDescription(`<:990yyes:1371830093252399196>・Le salon ${channel} est désormais défini comme salon de logs.`)
                .setColor(0x2F3136)
            ],
            ephemeral: true
        });
    },

    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addChannelOption(option => 
                option.setName("salon")
                    .setDescription("Le salon à définir comme logs")
                    .setRequired(false)
            );
    }
};

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

  module.exports = {
    name: "unowner",
    description: "Retirer le status d'owner d'un utilisateur",
    aliases: [],
    permissions: [],
    guildOwnerOnly: false,
    botOwnerOnly: true,
    botOwner: false,
    async executeSlash(client, interaction) {
        const user = interaction.options.getUser("user");

        if (!client.perms.owners.includes(user.id)) {
            const embed1 = new EmbedBuilder()
                .setColor(0xFF0000)
                .setDescription(`<:990not:1371830095391756379> 〃 ${user} n'est pas owner`);
            await interaction.reply({ embeds: [embed1], ephemeral: true });
            return;
        }
            
        client.perms.owners = client.perms.owners.filter(id => id !== user.id)
        client.savePerms()

        const embedYes = new EmbedBuilder()
            .setColor(0x00FF00)
            .setDescription(`<:990yyes:1371830093252399196> 〃 ${user} n'est plus owner`);
        await interaction.reply({ embeds: [embedYes], ephemeral: true });
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(o => o.setName("user").setDescription("Veuillez mentionner un utilisateur").setRequired(true))
    }
}
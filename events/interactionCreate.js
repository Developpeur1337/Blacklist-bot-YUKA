module.exports = {
    name: "interactionCreate",
    async execute(client, interaction) {
        if (!interaction.guild) return;

        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            if (command.permissions) {
                if (command.botOwnerOnly) {
                    if (!client.config.owners.includes(interaction.user.id)) return interaction.reply({
                        content: `\`❌\` 〃 Vous n'avez pas les permissions d'utiliser cette commande`,
                        ephemeral: true
                    });
                };

                if (command.guildOwnerOnly) {
                    if (interaction.member.guild.ownerId != interaction.user.id && !client.config.owners.includes(interaction.user.id)) return interaction.reply({
                        content: `\`❌\` 〃 Vous n'avez pas les permissions d'utiliser cette commande`,
                        ephemeral: true
                    });
                };

                if (command.botOwner){
                    if (!client.config.owners.includes(interaction.user.id) && !client.perms.owners.includes(interaction.user.id)) return interaction.reply({
                        content: `\`❌\` 〃 Vous n'avez pas les permissions d'utiliser cette commande`,
                        ephemeral: true
                    });
                }
                
                const authorPerms = interaction.channel.permissionsFor(interaction.user) || interaction.member.permissions;
                if (!authorPerms.has(command.permissions) && !client.config.owners.includes(interaction.user.id)) return interaction.reply({
                    content: `\`❌\` 〃 Vous n'avez pas les permissions d'utiliser cette commande`,
                    ephemeral: true
                });
            };

            command.executeSlash(client, interaction);
            console.log("[CMD-S]".brightBlue, `${interaction.guild.name} | ${interaction.channel.name} | ${interaction.user.tag} | ${command.name}`);
        };
    }
}
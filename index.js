const { Client, GatewayIntentBits, Partials, ActivityType, Collection } = require("discord.js");
const fs = require("node:fs");
const config = require('./config.json');
const colors = require('colors');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageTyping 
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent 
    ],
    presence: {
        activities: [{
            name: `discord.gg/yuka`,
            type: ActivityType.Streaming,
            url: "https://www.twitch.tv/developpeur1337"
        }],
        status: "online"
    },
    allowedMentions: {
        parse: ["roles", "users", "everyone"],
        repliedUser: false
    }
});

client.config = config;
client.perms = require('./db/db.json');
client.commands = new Collection();

client.saveConfig = () => {
    fs.writeFileSync('./config.json', JSON.stringify(client.config, null, 4), (err) => {
        if (err) console.error(err);
    });
};

client.savePerms = () => {
    fs.writeFileSync('./db/db.json', JSON.stringify(client.perms, null, 4), (err) => {
        if (err) console.error(err);
    });
};

const events = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of events) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
        client.on(event.name, (...args) => event.execute(client, ...args));
    }
}

const commandes = fs.readdirSync("./commandes").filter(file => file.endsWith(".js"));
for (const file of commandes) {
    const command = require(`./commandes/${file}`);
    client.commands.set(command.name, command);
}

async function errorHandler(error) {
    if ([10062, 10008, 50013, 40060].includes(error.code)) return;
    console.log(`[ERROR] ${error}`.red);
}
process.on("unhandledRejection", errorHandler);
process.on("uncaughtException", errorHandler);

client.login(client.config.token);

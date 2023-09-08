require('dotenv').config();
const { Client, Events, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction],
});
client.on('ready', async () => {
  console.log(`✅ ${client.user.username} ${client.user.id} ${client.user.tag} is online`);

});
client.on(Events.MessageReactionAdd, async (reaction, user) => {
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Error fetching:', error);
      return;
    }
  }
  if (reaction.emoji.name === '❌' && reaction.count >= 2) {
    const message = reaction.message;
    try {
      await message.delete();
      console.log(`Deleted Message: ${message}\nID: ${message.id}\nReaction Count: ${reaction.count}`);
    } catch (error) {
      console.error(`Failed to delete message with ID ${message.id}: ${error}`);
    }
  }
});

client.login(process.env.TOKEN);

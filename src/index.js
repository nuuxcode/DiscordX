require('dotenv').config();
const { Client, Events, GatewayIntentBits, Partials, MessageActionRow, MessageButton, AttachmentBuilder } = require('discord.js');

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
    Partials.Reaction,
  ],
});

client.on('ready', async () => {
  console.log(`✅ ${client.user.username} ${client.user.id} ${client.user.tag} is online`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (message.reference && message.channel.type === 0 && message.channel.name.startsWith('cohort')) {
    const replyMessage = await message.reply({
      content: `Hi ${message.author} Please use a thread to reply. :face_holding_back_tears:`,
      fetchReply: true,
    });
    setTimeout(() => {
      replyMessage.delete().catch(console.error);
    }, 10000);
    message.delete().catch(console.error);
    try {
      const imageAttachment = new AttachmentBuilder('https://i.imgur.com/wbSacOS.png');
      await message.author.send({
        content: `Hi ${message.author}, Please reply in the thread. :heart:\n\n` +
          "# Why It's Important to Use Threads Instead of Replies on Discord:\n\n" +
          "** Clean Channels:** Threads help keep your chat areas tidy and easy to find things in.\n" +
          "**Helping Others:** Threads make it simple to see who needs help, so you can reply quickly.\n" +
          "**All Talk in One Place:** Threads gather all the chat about a post in one spot, so you don't have to look through lots of different posts.\n" +
          "**Stay on Topic:** Threads help everyone stick to the main subject, so conversations make sense.\n" +
          "**No More Confusion:** Threads stop chat from getting all mixed up, making it easier for everyone to understand.\n\n" +
          "By using threads, you make your Discord chats cleaner and more organized, which makes it easier for everyone to have good conversations. :thread::speech_balloon:",
        files: [imageAttachment],
      });
    } catch (error) {
      console.error(`Failed to send DM to ${message.author.username}: ${error}`);
    }
  }
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

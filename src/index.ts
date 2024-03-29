import { Client, GatewayIntentBits, REST } from 'discord.js';
import CM from '@SharBot/commands';
import CommandManager from './commands/CommandManager';
import { config } from 'dotenv';
config();

const masterIDs = ['473072758629203980'];

const app = {
  client: new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  }),
  rest: new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN),
};
(async () => {
  //기본 명령어 로딩
  CM.commands.clear();
  console.log(`command initialization has been done in`);

  //디스코드 봇 로그인
  await app.client.login(process.env.DISCORD_TOKEN);
  console.log(`discord bot login has been done in`);
})();

app.client
  .once('ready', async () => {
    console.log(
      `Logged in as ${app.client.user?.tag}(${app.client.application?.id})`
    );
  })
  .on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand()) {
      const command = CM.commands.get(interaction.commandName);
      if (!command || !interaction.channel) return;
      await interaction.deferReply();

      if (interaction.channel.isDMBased() || !command.dmOnly)
        command.run(interaction);
      else
        await interaction.editReply(
          'This command is available only in the dm channel.'
        );
    }
  })
  .on('messageCreate', async (message) => {
    if (
      message.channel.isTextBased() &&
      message.guild != null &&
      (message.author.id == message.guild.ownerId ||
        masterIDs.includes(message.author.id))
    ) {
      const time = new Date().getTime();

      if (message.content == '!refresh') {
        message.reply(
          `guild command refresh start! server: ${message.guild.name}`
        );

        CM.commands.clear();
        CommandManager.init();
        await CM.refreshCommand('guild', message.guild);

        message.reply(
          `guild command refresh has been done in ${Date.now() - time}ms`
        );
      } else if (message.content == '!refresh global') {
        message.reply(`global command refresh start!`);

        CM.commands.clear();
        CommandManager.init();
        await CM.refreshCommand('global');

        message.reply(
          `global command refresh has been done in ${Date.now() - time}ms`
        );
      }
    }
  });

process
  .on('unhandledRejection', async (err) => {
    console.error(
      `[${new Date().toISOString()}] Unhandled Promise Rejection:\n`,
      err
    );
  })
  .on('uncaughtException', async (err) => {
    console.error(
      `[${new Date().toISOString()}] Uncaught Promise Exception:\n`,
      err
    );
  })
  .on('uncaughtExceptionMonitor', async (err) => {
    console.error(
      `[${new Date().toISOString()}] Uncaught Promise Exception (Monitor):\n`,
      err
    );
  });

export default app;

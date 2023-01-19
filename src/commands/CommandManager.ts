import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CommandCategory } from '../@type';
import CM from '.';

function registerCmd(
  builder: SlashCommandBuilder,
  callback: (interaction: ChatInputCommandInteraction) => void,
  category: CommandCategory = 'guild'
) {
  CM.register({
    category: category,
    dmOnly: false,
    debug: false,
    builder,
    setHiddenConfig: (arg) => arg,
    run: callback,
  });
}

namespace CommandManager {
  export function init() {
    registerCmd(
      new SlashCommandBuilder().setName('test').setDescription('test the bot'),
      async (interaction) => {}
    );
  }
}

export default CommandManager;

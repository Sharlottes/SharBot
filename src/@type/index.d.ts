import Discord, { CacheType } from 'discord.js';

import { PagesBuilder } from 'discord.js-pages';
import { BaseEmbed } from '@SharBot/modules';
import 'node';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_TOKEN: string;
    }
  }
}
export type Message = {
  interaction: Discord.CommandInteraction<CacheType>;
  builder: BaseEmbed;
  sender: User;
};

export type CommandInfo = {
  id: string;
  application_id: string;
  version: string;
  default_permissions: null;
  type: number;
  name: string;
  description: string;
  guild_id: string;
};

export type CommandCategory = 'guild' | 'global';

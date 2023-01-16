import {
  Client, GatewayIntentBits, Events,
  SlashCommandBuilder,
} from "discord.js";

import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v9";

var client = null;
var rest = null;

export function newServer(v = "9", token) {
  rest = new REST({version: v}).setToken(token);
  return rest;
}

export function newClient(token = null) {
  const e = 
  new Client({intents: [GatewayIntentBits.Guilds]});
  client = e;
  if(token !== null) e.login(token);
  return e;
}

export const events = {
  ready(e) {client.once(Events.ClientReady, e)},
};

export async function putCommands(arr = []) {
  try {
    return await rest.put(
      Routes.applicationCommands(process.env.client_id),
      {body: arr},
    );
  } catch(err) {
    console.error("Error: " + err);
  }
}

export async function listenForCommands(f) {
  return client.on(Events.InteractionCreate, f);
}

export function isUserBot(e) {return e.bot}

export function sendMsg({guild, channel, msg}) {
  return client.guilds.cache
  .get(guild).channels.cache
  .get(channel).send(msg);
}

export function sendBasicMsg(e, msg) {
  return sendMsg({
    guild: e.guildId,
    channel: e.channelId,
    msg,
  });
}

export function isValidMsg(e) {
  if(e.length > 2000) return [false, "Message is too long"];
  return [true, null];
}

export function getUserId(mention) {
  return mention.match(/\d/g).join("");
}

export function getUserGuild(e, id) {
  return e.guild.members.cache.get(id);
}
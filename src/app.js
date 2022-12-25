import {newClient, events, putCommands, newServer, listenForCommands} 
from "./framework.js";
import {commands, commandMain, commandExec} from "./commands.js"

const client = newClient(process.env.bot_token);
events.ready(() => console.log("ready"));

const rest = newServer("9", process.env.bot_token);
const jsonCommands = [];
for(const i of commandMain) jsonCommands.push(i.toJSON());

putCommands(jsonCommands)
.then(() => listenForCommands(async e => {
  const exec = commandExec[e.commandName];
  if(exec) {
    exec(e);
  } else {
    console.error(new Error(`Command "${e.commandName}" not found`));
  }
}));


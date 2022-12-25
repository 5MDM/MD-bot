import {SlashCommandBuilder} from "@discordjs/builders";
import {sendMsg, sendBasicMsg, isValidMsg} from "./framework.js";

const commands = [];
const commandMain = [];
const commandExec = {};

function push([name, a, b]) {
  commandMain.push(a);
  commands.push([a, b]);
  commandExec[name] = b;
}

push([
  "say",
  new SlashCommandBuilder()
  .setName("say")
  .setDescription("Make the bot say something")
  .addStringOption(opt => 
    opt.setName("text")
    .setDescription("What the bot will say")
    .setRequired(true)
  ),
  async function(e) {
    const txt = e.options.getString("text");
    const [ok, err] = isValidMsg(txt);
    if(ok) {
      await e.reply({content: "Message sent", ephemeral: true});
      sendBasicMsg(e, txt);
    } else {
      await e.reply({content: "Error: " + err, ephemeral: true});
    }
  },
]);
push([
  "date",
  new SlashCommandBuilder()
  .setName("date")
  .setDescription("Show today's real date"),
  async function(e) {
    const date = (() => {
      const year=new Date().getFullYear();
      function between(start, end){start=new Date(start);
      end=new Date(end);const day=1000*60*60*24;
      const ms=end.getTime()-start.getTime();
      return Math.round(ms/day)}const october=`10/1/${ year }`;
      var start=new Date();var startYear=start.getFullYear();
      if(start.getMonth()<9){startYear++}start=
      `${start.getMonth()+1}/${start.getDate()+1}/${ startYear }`;
      const endDate=between(october,start).toString();
      var finalDate=endDate;switch(Number(endDate[endDate.length-1]))
      {case 1:finalDate+="st";break;case 2:finalDate+="nd";break;
      case 3:finalDate+="rd";break;default:finalDate+="th"}
      return finalDate;
    })();
    await e.reply("Today is October " + date);
  },
]);
push([
  "js",
  new SlashCommandBuilder()
  .setName("js")
  .setDescription("Owner only")
  .addStringOption(opt => 
    opt.setName("code")
    .setDescription("What the bot will run")
    .setRequired(true)
  ),
  async function(e) {
    const code = e.options.getString("code");
    if(e.user.id != 991058126339977247) {
      await e.reply({
        content: `Happy birthday <@${e.user.id}>`,
        ephemeral: true,
      });
    } else {
      eval(code);
      await e.reply({
        content: "Code succesfully ran",
        ephemeral: true,
      });
    }
  },
]);

push([
  "console",
  new SlashCommandBuilder()
  .setName("console")
  .setDescription("Logs something to my console")
  .addStringOption(opt => 
    opt.setName("text")
    .setDescription("What to log")
    .setRequired(true)
  ),
  async function(e) {
    console.log("New message: " + e.options.getString("text"));
    await e.reply({
      content: "Logged succesfully",
      ephemeral: true,
    });
  },
]);
/*
push([
  "button",
  new SlashCommandBuilder()
  .setName("button")
  .setDescription("DON'T CLICK"),
  async function(e) {
    
  },
]);*/

export {commands, commandMain, commandExec};
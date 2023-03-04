import {SlashCommandBuilder} from "@discordjs/builders";
import {sendMsg, sendBasicMsg, isValidMsg, getUserId, getUserGuild, getIdFromMention} 
from "./framework.js";
import {client} from "./app.js";

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
  //.addUserOption(opt => 
  //  opt.setName("user")
  //  .setDescription("User to impersonate")
  //  .setRequired(false)
  //),
  async function(e) {
    const txt = e.options.getString("text");
    //const user = e.options.getString("user");
    const [ok, err] = isValidMsg(txt);
    
    async function send() {
      sendBasicMsg(e, txt);
      
      await e.reply({content: "Message sent", ephemeral: true});
    }
    
    function checkForCurse(msg) {
      if(msg == "curse test") return true;
      const removeSpecial = /[a-zA-Z]/g;
      const curseRegex = /n+(e|i|1|l)+(g|q)+(e|a)+r*/g;
      
      msg = msg.match(removeSpecial).join("");
      msg = msg.match(curseRegex);
      if(msg === null) {
        return false;
      } else {
        return true;
      }
    }
    
    if(ok) {
      if(!checkForCurse(txt)) {
        send();
      } else {
        console.log(`${e.member.user.tag} cursed!`);
        await e.reply({content: "You can't say slurs", ephemeral: true});
      }
    } else {
      await e.reply({content: "Error: " + err, ephemeral: true});
    }
  },
]);
push([
  "daye",
  new SlashCommandBuilder()
  .setName("daye")
  .setDescription("Shows today's daye"),
  async function(e) {
    const daye = Math.round(Date.now()/1000);
    await e.reply(`Todaye is <t:${daye}:D>`);
  }
]);
push([
  "date",
  new SlashCommandBuilder()
  .setName("date")
  .setDescription("Shows today's real date"),
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
    const txt = e.options.getString("text");
    const [ok, err] = isValidMsg(txt);
    if(ok) {
      console.log("New message: " + txt);
      await e.reply({
        content: "Logged succesfully",
        ephemeral: true,
      });
    } else {
      await e.reply({content: "Error: " + err, ephemeral: true});
    }
  },
]);
push([
  "birthday",
  new SlashCommandBuilder()
  .setName("birthday")
  .setDescription("There is nothing here. Go back"),
  async function(e) {
    await e.reply("Nothing happens <t:1703098500:R>");
  },
]);

push([
  "dm",
  new SlashCommandBuilder()
  .setName("dm")
  .setDescription("Dms someone")
  .addStringOption(opt => 
    opt.setName("user")
    .setDescription("Who to dm")
    .setRequired(true)
  )
  .addStringOption(opt =>
    opt.setName("message")
    .setDescription("The message to send")
    .setRequired(true)
  ),
  async function(e) {
    if(e.user.id != 991058126339977247) {
      await e.reply({
        content: `<@${e.user.id}> no`,
        ephemeral: true,
      });
      
      return;
    }
    
    var us;
    try {
      us = await client.users.fetch(
        getIdFromMention(e.options.getString("user"))
      );
    } catch(err) {
      return await e.reply({content: `Error: ${err}`, ephemeral: true});
    }
    
    us.send(e.options.getString("message"));
    
    await e.reply({content: "Message sent!", ephemeral: true});
  }
]);

push([
  "role",
  new SlashCommandBuilder()
  .setName("role")
  .setDescription("Check's someone's role")
  .addStringOption(opt =>
    opt.setName("user")
    .setDescription("The user to check the role")
    .setRequired(true)
  ),
  async function(e) {
    if(e.user.id != 991058126339977247) {
      await e.reply({
        content: `<@${e.user.id}> Error`,
        ephemeral: true,
      });
      
      return;
    }
    
    var us;
    try {
      us = await client.users.fetch(
        getIdFromMention(e.options.getString("user"))
      );
    } catch(err) {
      return await e.reply({content: `Error: ${err}`, ephemeral: true});
    }
    
    const roleName = "md role";
    
    const foundRole = e.guild.roles.find(r => 
      r.name === roleName
    );
    
    if(!foundRole) {
      // if not found
      console.log("not found");
      createRole();
    } else {
      // if found
      console.log("found");
      assign();
    }
    
    function createRole() {
      e.guild.roles.create({
        data: {
          name: roleName,
          color: 'BLUE',
        },
        reason: "Buffer role for md bot do not delete",
      }).then(e => assign()).catch(console.error);
    }
    
    function assign() {
      
    }
  },
]);

export {commands, commandMain, commandExec};
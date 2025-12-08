const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "help",
    aliases: ["h"],
    version: "2.0",
    author: "Farhan Hasan",
    role: 0,
    shortDescription: { en: "Stylish full command list" },
    longDescription: { en: "Shows a beautiful box-style command list with categories" },
    category: "info",
    guide: "{pn} | {pn} <command>"
  },

  onStart: async function ({ api, event, args }) {
    const prefix = global.GoatBot.config.prefix;
    const commandName = args[0];

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // If user wants details of one command: !help uptime
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (commandName) {
      const cmd = global.GoatBot.commands.get(commandName) || global.GoatBot.aliases.get(commandName);
      if (!cmd) return api.sendMessage(`❌ Command not found: ${commandName}`, event.threadID);

      let info = `✨ 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗜𝗻𝗳𝗼 ✨\n\n`;
      info += `🔸 Name: ${cmd.config.name}\n`;
      info += `🔸 Aliases: ${cmd.config.aliases?.join(", ") || "None"}\n`;
      info += `🔸 Category: ${cmd.config.category}\n`;
      info += `🔸 Description: ${cmd.config.longDescription?.en || "No description"}\n`;
      info += `🔸 Usage: ${cmd.config.guide || "Not provided"}\n`;

      return api.sendMessage(info, event.threadID);
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // AUTO GROUP BY CATEGORY
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const commandsByCat = {};

    for (const [name, cmd] of global.GoatBot.commands) {
      const cat = cmd.config.category || "Other";
      if (!commandsByCat[cat]) commandsByCat[cat] = [];
      commandsByCat[cat].push(cmd.config.name);
    }

    // SORT alphabetically
    for (const c in commandsByCat)
      commandsByCat[c].sort((a, b) => a.localeCompare(b));

    const totalCommands = global.GoatBot.commands.size;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // MAKE FANCY BOX HELP STRING
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    let msg = `✨ 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐋𝐢𝐬𝐭 ✨\n\n`;

    for (const cat of Object.keys(commandsByCat)) {
      msg += `┌─❏ ${cat}\n`;

      const list = commandsByCat[cat];
      for (let i = 0; i < list.length; i += 3) {
        msg += `│  ❍ ${prefix}${list[i]}`;
        if (list[i + 1]) msg += `   ❍ ${prefix}${list[i + 1]}`;
        if (list[i + 2]) msg += `   ❍ ${prefix}${list[i + 2]}`;
        msg += `\n`;
      }

      msg += `└──────────────⚬\n`;
    }

    msg += `
╭───────────────➣
│ ᴄᴜʀʀᴇɴᴛʟʏ, ᴛʜᴇ ʙᴏᴛ ʜᴀs [${totalCommands}] ᴄᴏᴍᴍᴀɴᴅs 😘🎀
│ ᴜsᴇ ${prefix}help (ᴄᴍᴅ) ᴛᴏ ɢᴇᴛ ᴍᴏʀᴇ ᴅᴇᴛᴀɪʟs 🙌🏻
│ ᴄʀᴇᴀᴛᴏʀ: ғᴀʀʜᴀɴ ʜᴀsᴀɴ ᴊɪʙᴏɴ 👀
╰───────────────➣`;

    return api.sendMessage(msg, event.threadID);
  }
};

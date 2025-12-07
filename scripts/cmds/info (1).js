const moment = require('moment-timezone');
const axios = require('axios');

module.exports = {
  config: {
    name: "info",
    aliases: ["inf", "in4"],
    version: "3.6",
    author: "Eren + Modified by Farhan",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Shows bot and owner info with video."
    },
    longDescription: {
      en: "Displays detailed information about the bot and owner, including uptime, ping, social links, and local time."
    },
    category: "Information",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message }) {
    this.sendInfo(message);
  },

  onChat: async function ({ event, message }) {
    if (event.body && event.body.toLowerCase() === "info") {
      this.sendInfo(message);
    }
  },

  sendInfo: async function (message) {
    const botName = "✰→ ғᴀʀʜᴀɴ ʙᴏᴛ ←✰";
    const ownerName = "𝐅𝐚𝐫𝐇𝐚𝐧 𝐀𝐇𝐦𝐞𝐝";
    const moderatedBy = "𝐗𝐨𝐬𝐬 𝐅𝐚𝐫𝐇𝐚𝐧";
    const religion = "𝐈𝐬𝐥𝐚𝐦";
    const botStatus = "𝗦𝗶𝗻𝗴𝗹𝗲 💔";
    const address = "𝐒𝐢𝐫𝐚𝐣𝐠𝐚𝐧𝐣 𝐒𝐚𝐝𝐚𝐫 🏙️";
    const userClass = "𝐈𝐧𝐭𝐞𝐫 1𝐬𝐭 𝐘𝐞𝐚𝐫 🎓";
    const facebook = "https://www.facebook.com/farhuu.2.0";
    const instagram = "https://www.instagram.com/farhuu.2.0";

    // Time setup
    const now = moment().tz('Asia/Dhaka');
    const localTime = now.format('hh:mm:ss A');

    // Uptime
    const uptime = process.uptime();
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const uptimeString = `${hours}h ${minutes}m ${seconds}s`;

    // Ping
    const start = Date.now();
    await new Promise(resolve => setTimeout(resolve, 100));
    const ping = Date.now() - start;

    const videoUrl = "https://files.catbox.moe/pxuoqo.mp4";

    const body = `
╭─ <𝐎𝐖𝐍𝐄𝐑  𝐈𝐍𝐅𝐎> ─╮
├──────────────⍟
│ 👑 𝐎𝐰𝐧𝐞𝐫: ${ownerName}
│ ⚙️ 𝐌𝐨𝐝𝐞𝐫𝐚𝐭𝐞𝐝 𝐛𝐲: ${moderatedBy}
│ 🏫 𝐂𝐥𝐚𝐬𝐬: ${userClass}
│ 🏠 𝐀𝐝𝐝𝐫𝐞𝐬𝐬: ${address}
│ 🌍 𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧: ${religion}
│ 🧬 𝐒𝐭𝐚𝐭𝐮𝐬: ${botStatus}
│ 📘 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤: ${facebook}
│ 📸 𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦: ${instagram}
├───────────⍟
│
│𖣘 <𝐁𝐎𝐓  𝐈𝐍𝐅𝐎> 𖣘
├───────────⍟
│ 🤖 𝐁𝐨𝐭 𝐍𝐚𝐦𝐞: ${botName}
│ 🕐 𝐓𝐢𝐦𝐞: ${localTime}
│ 🌀 𝐔𝐩𝐭𝐢𝐦𝐞: ${uptimeString}
│ ⚡ 𝐏𝐢𝐧𝐠: ${ping}𝐦𝐬
╰───────────╯
`;

    try {
      const response = await axios.get(videoUrl, { responseType: 'stream' });

      message.reply({
        body,
        attachment: response.data
      });
    } catch (err) {
      console.error(err);
      message.reply("⚠️ Failed to load video.");
    }
  }
};

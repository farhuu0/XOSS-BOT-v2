const { writeFileSync } = require("fs-extra");
const { config } = global.GoatBot;
const { client } = global;

module.exports = {
  config: {
    name: "whitelists",
    aliases: ["wlonly", "onlywlst", "onlywhitelist", "wl"],
    version: "1.5",
    author: "NTKhang",
    countDown: 5,
    role: 0,
    description: {
      en: "Add, remove, edit whiteListIds role",
    },
    category: "owner",
    guide: {
      en:
        "   {pn} [add | -a] <uid | @tag>: Add whiteListIds role for user" +
        "\n	  {pn} [remove | -r] <uid | @tag>: Remove whiteListIds role of user" +
        "\n	  {pn} [list | -l]: List all whiteListIds" +
        "   {pn} -m [on | off]: turn on/off the mode only whitelistIds can use bot" +
        "\n {pn} -m noti [on | off]: turn on/off the notification when user is not whitelistIds use bot",
    },
  },

  langs: {
    en: {
      added: `â•­âœ¦âœ… | ð™°ðšðšðšŽðš %1 ðšžðšœðšŽðš›/ðšœ\n%2`,
      alreadyAdded: `\nâ•­âœ¦âš ï¸ | ð™°ðš•ðš›ðšŽðšŠðšðš¢ ðšŠðšðšðšŽd %1 ðšžðšœðšŽðš›ðšœ\n%2`,
      missingIdAdd: "âš ï¸ | ð™¿ðš•ðšŽðšŠðšœðšŽ ðšŽðš—ðšðšŽðš› ðš„ð™¸ð™³ ðšðš˜ ðšŠðšðš ðš ðš‘ðš’ðšðšŽð™»ðš’ðšœðš ðš›ðš˜ðš•ðšŽ",
      removed: `â•­âœ¦âœ… | ðšðšŽðš–ðš˜ðšŸðšŽðš %1 ðšžðšœðšŽðš›ðšœ\n%2`,
      notAdded: `â•­âœ¦âš ï¸ | ð™³ðš’ðšðš—'ðš ðšŠðšðšðšŽðš %1 ðšžðšœðšŽðš›ðšœ\n%2`,
      missingIdRemove: "âš ï¸ | ð™¿ðš•ðšŽðšŠðšœðšŽ ðšŽðš—ðšðšŽðš› ðš„ð™¸ð™³ ðšðš˜ ðš›ðšŽðš–ðš˜ðšŸðšŽ ðš ðš‘ðš’ðšðšŽð™»ðš’ðšœðš ðš›ðš˜ðš•ðšŽ",
      listAdmin: `â•­âœ¦âœ¨ | ð™»ðš’ðšœðš ðš˜ðš ðš„ðšœðšŽðš›ð™¸ð™³s\n%1\nâ•°â€£`,
      turnedOn: "âœ… | ðšƒðšžðš›ðš—ðšŽðš ðš˜ðš— ðšðš‘ðšŽ ðš–ðš˜ðšðšŽ ðš˜ðš—ðš•ðš¢ ðš ðš‘ðš’ðšðšŽðš•ðš’ðšœðšð™¸ðšðšœ ðšŒðšŠðš— ðšžðšœðšŽ ðš‹ðš˜ðš",
      turnedOff: "âŽ | ðšƒðšžðš›ðš—ðšŽðš ðš˜ðšðš ðšðš‘ðšŽ ðš–ðš˜ðšðšŽ ðš˜ðš—ðš•ðš¢ ðš ðš‘ðš’ðšðšŽðš•ðš’ðšœðšð™¸ðšðšœ ðšŒðšŠðš— ðšžðšœðšŽ ðš‹ðš˜ðš",
      turnedOnNoti:
        "âœ… | ðšƒðšžðš›ðš—ðšŽðš ðš˜ðš— ðšðš‘ðšŽ ðš—ðš˜ðšðš’ðšðš’ðšŒðšŠðšðš’ðš˜ðš— ðš ðš‘ðšŽðš— ðšžðšœðšŽðš› ðš’ðšœ ðš—ðš˜ðš ðš ðš‘ðš’ðšðšŽðš•ðš’ðšœðšð™¸ðšðšœ ðšžðšœðšŽ ðš‹ðš˜ðš",
      turnedOffNoti:
        "âŽ | ðšƒðšžðš›ðš—ðšŽðš ðš˜ðšðš ðšðš‘ðšŽ ðš—ðš˜ðšðš’ðšðš’ðšŒðšŠðšðš’ðš˜ðš— ðš ðš‘ðšŽðš— ðšžðšœðšŽðš› ðš’ðšœ ðš—ðš˜ðš ðš ðš‘ðš’ðšðšŽðš•ðš’ðšœðšð™¸ðšðšœ ðšžðšœðšŽ ðš‹ðš˜ðš",
    },
  },

  onStart: async function ({ message, args, usersData, event, getLang, api }) {
    const permission = global.GoatBot.config.adminBot;
    if (!permission.includes(event.senderID)) {
      api.sendMessage(args.join(" "), event.threadID, event.messageID);
      return;
    }
    switch (args[0]) {
      case "add":
      case "-a":
      case "+": {
        if (args[1] = '+') {
          let uids = [];
          if (Object.keys(event.mentions).length > 0)
            uids = Object.keys(event.mentions);
          else if (event.messageReply) uids.push(event.messageReply.senderID);
          else uids = args.filter((arg) => !isNaN(arg));
          const notWLIds = [];
          const authorIds = [];
          for (const uid of uids) {
            if (config.whiteListMode.whiteListIds.includes(uid))
              authorIds.push(uid);
            else notWLIds.push(uid);
          }

          config.whiteListMode.whiteListIds.push(...notWLIds);
          const getNames = await Promise.all(
            uids.map((uid) =>
              usersData.getName(uid).then((name) => ({ uid, name }))
            )
          );
          writeFileSync(
            global.client.dirConfig,
            JSON.stringify(config, null, 2)
          );
          return message.reply(
            (notWLIds.length > 0
              ? getLang(
                  "added",
                  notWLIds.length,
                  getNames
                    .map(
                      ({ uid, name }) =>
                        `â”œâ€£ ðš„ðš‚ð™´ðš ð™½ð™°ð™¼ð™´: ${name}\nâ”œâ€£ ðš„ðš‚ð™´ðš ð™¸ð™³: ${uid}`
                    )
                    .join("\n")
                )
              : "") +
              (authorIds.length > 0
                ? getLang(
                    "alreadyAdded",
                    authorIds.length,
                    authorIds.map((uid) => `â”œâ€£ ðš„ðš‚ð™´ðš ð™¸ð™³: ${uid}`).join("\n")
                  )
                : "")
          );
        } else return message.reply(getLang("missingIdAdd"));
      }
      case "remove":
      case "rm":
      case "-r":
      case "-": {
        if (args[1] = '-') {
          let uids = [];
          if (Object.keys(event.mentions).length > 0)
            uids = Object.keys(event.mentions)[0];
          else
            uids =
              args.filter((arg) => !isNaN(arg)) || event.messageReply.senderID;
          const notWLIds = [];
          const authorIds = [];
          for (const uid of uids) {
            if (config.whiteListMode.whiteListIds.includes(uid))
              authorIds.push(uid);
            else notWLIds.push(uid);
          }
          for (const uid of authorIds)
            config.whiteListMode.whiteListIds.splice(
              config.whiteListMode.whiteListIds.indexOf(uid),
              1
            );
          const getNames = await Promise.all(
            authorIds.map((uid) =>
              usersData.getName(uid).then((name) => ({ uid, name }))
            )
          );
          writeFileSync(
            global.client.dirConfig,
            JSON.stringify(config, null, 2)
          );
          return message.reply(
            (authorIds.length > 0
              ? getLang(
                  "removed",
                  authorIds.length,
                  getNames
                    .map(
                      ({ uid, name }) =>
                        `â”œâ€£ ðš„ðš‚ð™´ðš ð™½ð™°ð™¼ð™´: ${name}\nâ”œâ€£ ðš„ðš‚ð™´ðš ð™¸ð™³: ${uid}`
                    )
                    .join("\n")
                )
              : "") +
              (notWLIds.length > 0
                ? getLang(
                    "notAdded",
                    notWLIds.length,
                    notWLIds.map((uid) => `â”œâ€£ ðš„ðš‚ð™´ðš ð™¸ð™³: ${uid}`).join("\nâ”œ\n")
                  )
                : "")
          );
        } else return message.reply(getLang("missingIdRemove"));
      }
      case "list":
      case "-l": {
        const getNames = await Promise.all(
          config.whiteListMode.whiteListIds.map((uid) =>
            usersData.getName(uid).then((name) => ({ uid, name }))
          )
        );
        return message.reply(
          getLang(
            "listAdmin",
            getNames
              .map(
                ({ uid, name }) => `â”œâ€£ ðš„ðš‚ð™´ðš ð™½ð™°ð™¼ð™´: ${name}\nâ”œâ€£ ðš„ðš‚ð™´ðš ð™¸ð™³: ${uid}`
              )
              .join("\n")
          )
        );
      }
      case "m":
      case "mode":
      case "-m": {
        let isSetNoti = false;
        let value;
        let indexGetVal = 1;

        if (args[1] == "noti") {
          isSetNoti = true;
          indexGetVal = 2;
        }

        if (args[indexGetVal] == "on") value = true;
        else if (args[indexGetVal] == "off") value = false;
        if (isSetNoti) {
          config.hideNotiMessage.whiteListMode = !value;
          message.reply(getLang(value ? "turnedOnNoti" : "turnedOffNoti"));
        } else {
          config.whiteListMode.enable = value;
          message.reply(getLang(value ? "turnedOn" : "turnedOff"));
        }

        writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
      }
      default:
    }
  },
};

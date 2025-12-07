const fs = require("fs-extra");
const { utils } = global;

module.exports = {
	config: {
		name: "prefix",
		version: "1.6",
		author: "BaYjid",
		countDown: 5,
		role: 0,
		description: "🛠️ Change the bot prefix in your chat box or the entire system (only bot admin)",
		category: "⚙️ Configuration",
		guide: {
			en: 
				"━━━━━━━━━━━━━━━━━━━\n"
				+ "📌 {pn} <new prefix>: Change the prefix in your chat box\n"
				+ "━━━━━━━━━━━━━━━━━━━\n"
				+ "📍 Example:\n"
				+ "🔹 {pn} #\n"
				+ "━━━━━━━━━━━━━━━━━━━\n"
				+ "📌 {pn} <new prefix> -g: Change the prefix in the entire system (only bot admin)\n"
				+ "━━━━━━━━━━━━━━━━━━━\n"
				+ "📍 Example:\n"
				+ "🔹 {pn} # -g\n"
				+ "━━━━━━━━━━━━━━━━━━━\n"
				+ "🛠️ {pn} reset: Reset your chat box prefix to default\n"
				+ "━━━━━━━━━━━━━━━━━━━"
		}
	},

	langs: {
		en: {
			reset: 
				"━━━━━━━━━━━━━━━━━━━\n"
				+ "✅ Your prefix has been reset to default: %1\n"
				+ "━━━━━━━━━━━━━━━━━━━",
			onlyAdmin: 
				"━━━━━━━━━━━━━━━━━━━\n"
				+ "⚠️ Only admin can change the system prefix!\n"
				+ "━━━━━━━━━━━━━━━━━━━",
			confirmGlobal: 
				"━━━━━━━━━━━━━━━━━━━\n"
				+ "🔄 Please react to this message to confirm changing the system prefix.\n"
				+ "━━━━━━━━━━━━━━━━━━━",
			confirmThisThread: 
				"━━━━━━━━━━━━━━━━━━━\n"
				+ "🔄 Please react to this message to confirm changing the prefix in your chat group.\n"
				+ "━━━━━━━━━━━━━━━━━━━",
			successGlobal: 
				"━━━━━━━━━━━━━━━━━━━\n"
				+ "✅ System prefix has been changed to: %1\n"
				+ "━━━━━━━━━━━━━━━━━━━",
			successThisThread: 
				"━━━━━━━━━━━━━━━━━━━\n"
				+ "✅ Chat group prefix has been changed to: %1\n"
				+ "━━━━━━━━━━━━━━━━━━━",
			myPrefix: 
				"━━━━━━━━━━━━━━━━━━━\n"
				+ "🌍 System Prefix: %1\n"
				+ "💬 Your Group Prefix: %2\n"
				+ "⏰ Server Time: %3\n"
				+ "━━━━━━━━━━━━━━━━━━━\n"
				+ "💡 To use commands, type ➜ %2help to see available commands!\n"
				+ "━━━━━━━━━━━━━━━━━━━"
		}
	},

	onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
		if (!args[0]) return message.SyntaxError();

		if (args[0] === "reset") {
			await threadsData.set(event.threadID, null, "data.prefix");
			return message.reply(getLang("reset", global.GoatBot.config.prefix));
		}

		const newPrefix = args[0];
		const formSet = {
			commandName,
			author: event.senderID,
			newPrefix,
			setGlobal: args[1] === "-g"
		};

		if (formSet.setGlobal && role < 2) {
			return message.reply(getLang("onlyAdmin"));
		}

		const confirmMessage = formSet.setGlobal ? getLang("confirmGlobal") : getLang("confirmThisThread");
		return message.reply(confirmMessage, (err, info) => {
			formSet.messageID = info.messageID;
			global.GoatBot.onReaction.set(info.messageID, formSet);
		});
	},

	onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
		const { author, newPrefix, setGlobal } = Reaction;
		if (event.userID !== author) return;

		if (setGlobal) {
			global.GoatBot.config.prefix = newPrefix;
			fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
			return message.reply(getLang("successGlobal", newPrefix));
		}

		await threadsData.set(event.threadID, newPrefix, "data.prefix");
		return message.reply(getLang("successThisThread", newPrefix));
	},

	onChat: async function ({ event, message, getLang }) {
		if (event.body && event.body.toLowerCase() === "prefix") {
			const serverTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }); 
			
			return message.reply({
				body: getLang("myPrefix", global.GoatBot.config.prefix, utils.getPrefix(event.threadID), serverTime),
				attachment: await global.utils.getStreamFromURL("https://drive.google.com/uc?export=download&id=1SqT78Qk_sUjm-0lpFyjty_L8PXj8Cd9s")
			});
		}
	}
};

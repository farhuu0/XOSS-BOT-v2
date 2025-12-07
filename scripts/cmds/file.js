const fs = require('fs');
const path = require('path');

module.exports = {
	config: {
		name: "file",
		version: "1.0",
		author: "xnil6x",
		countDown: 5,
		role: 0,
		shortDescription: "Send bot script",
		longDescription: "Send specified file from any location",
		category: "owner",
		guide: "{pn} <file path>. Ex: .{pn} scripts/cmds/curl.js"
	},

	onStart: async function ({ message, args, api, event }) {
		const permission = ["100080736881604","61578270134835"];
		if (!permission.includes(event.senderID)) {
			return api.sendMessage("খনিকের পোলা ফাইল তোমার পু৳কি দিয়ে ভরে দিব 😾.", event.threadID, event.messageID);
		}

		const filePath = args.join(" ");
		if (!filePath) {
			return api.sendMessage("Please provide a file path.", event.threadID, event.messageID);
		}

		const absolutePath = path.resolve(filePath);
		if (!fs.existsSync(absolutePath)) {
			return api.sendMessage(`File not found: ${filePath}`, event.threadID, event.messageID);
		}

		const fileContent = fs.readFileSync(absolutePath, 'utf8');
		api.sendMessage({ body: fileContent }, event.threadID);
	}
};

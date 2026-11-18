
const { keith, commands } = require('../commandHandler');

const OWNER_NUMBER = "255610209120";
const BOT_NAME = "PUPPY-X";

keith({
  pattern: "owner",
  aliases: ["ownermenu", "ownerinfo"],
  category: "Owner",
  description: "Premium Owner Dashboard"
}, async (from, client, conText) => {

  const { mek, reply, isSuperUser, pushName } = conText;

  if (!isSuperUser) {
    return reply("🚫 This dashboard is restricted to the Owner.");
  }

  try {
    const ownerName =
      mek.pushName ||
      pushName ||
      "NYONI Owner";

    const ownerCommands = (commands || [])
      .filter(cmd =>
        cmd.category?.toLowerCase() === "owner" &&
        !cmd.dontAddCommandList
      );

    const commandNames = ownerCommands
      .map((cmd, i) => `│ ${i + 1}. ${cmd.pattern}`)
      .join("\n");

    const menu = `
╭━━━━━━━━━━━━━━━━━━━━━━╮
       👑 *${BOT_NAME}*
       ✦ OWNER DASHBOARD ✦
╰━━━━━━━━━━━━━━━━━━━━━━╯

┏━━━〔 👤 OWNER PROFILE 〕
┃
┃ ✨ *Name:* ${ownerName}
┃ 📱 *Number:* ${OWNER_NUMBER}
┃ 👑 *Role:* SUPER OWNER
┃ 🤖 *Bot:* ${BOT_NAME}
┃ 🔐 *Access:* AUTHORIZED
┃
┗━━━━━━━━━━━━━━━━━━━━

┏━━━〔 ⚡ SYSTEM STATUS 〕
┃
┃ 🟢 *Status:* ONLINE
┃ 💎 *Mode:* PREMIUM
┃ 🛠️ *Owner Commands:* ${ownerCommands.length}
┃ 📅 *Date:* ${new Date().toLocaleDateString()}
┃ ⏰ *Time:* ${new Date().toLocaleTimeString()}
┃
┗━━━━━━━━━━━━━━━━━━━━

┏━━━〔 🔥 OWNER COMMANDS 〕
┃
${commandNames || "┃ No owner commands found."}
┃
┗━━━━━━━━━━━━━━━━━━━━

╭━━━━━━━━━━━━━━━━━━━━━━╮
  💠 *POWERED BY ${BOT_NAME}*
  👑 *OWNER ACCESS ONLY*
╰━━━━━━━━━━━━━━━━━━━━━━╯

> _Your Bot. Your Rules. Your Empire._`;

    await client.sendMessage(from, {
      text: menu,
      contextInfo: {
        mentionedJid: [mek.sender],
        externalAdReply: {
          title: `${BOT_NAME} | OWNER CONTROL`,
          body: `Welcome ${ownerName} 👑`,
          thumbnailUrl: "https://h.uguu.se/JaoRuOdMRHkV.jpg",
          sourceUrl: "https://github.com",
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: mek });

  } catch (error) {
    console.error("Owner menu error:", error);
    reply("❌ Failed to load Owner Dashboard.");
  }
});


const { keith, commands } = require('../commandHandler');

const OWNER_NUMBER = "255610209120";
const BOT_NAME = "PUPPY-X";
const MENU_IMAGE = "https://h.uguu.se/JaoRuOdMRHkV.jpg";

keith({
  pattern: "owner2",
  aliases: ["eliteowner", "owner-menu2"],
  category: "Owner",
  description: "PUPPY-X Soft Luxury Owner Menu"
}, async (from, client, conText) => {

  const { mek, reply, isSuperUser, pushName } = conText;

  if (!isSuperUser)
    return reply("⛔ Owner access only.");

  try {
    const name = mek.pushName || pushName || "Owner";

    const ownerCommands = (commands || []).filter(c =>
      c.category?.toLowerCase() === "owner" &&
      !c.dontAddCommandList
    );

    const cmdList = ownerCommands.length
      ? ownerCommands.map(c => `  ➤  .${c.pattern}`).join("\n")
      : "  ➤  No commands found";

    const now = new Date();

    const menu = `
       ˚₊‧꒰ა ♛ ໒꒱ ‧₊˚
       *${BOT_NAME}*
      ୨୧ OWNER COLLECTION ୨୧
    ───────────────

  ✧ 𝙒𝙀𝙇𝘾𝙊𝙈𝙀, ${name}
  ┊ 👑 Rank   ➤ SUPER OWNER
  ┊ 📱 Number ➤ ${OWNER_NUMBER}
  ┊ 🔐 Access ➤ AUTHORIZED

    ────── ⋆⋅☆⋅⋆ ──────
       ✦ SYSTEM STATUS ✦

  ┊ 🟢 Status  ➤ ONLINE
  ┊ 💎 Edition ➤ PREMIUM
  ┊ ⚙️ Commands ➤ ${ownerCommands.length}
  ┊ 📅 Date    ➤ ${now.toLocaleDateString()}

    ────── ⋆⋅☆⋅⋆ ──────
        ♛ OWNER COMMANDS ♛

${cmdList}

    ────── ⋆⋅☆⋅⋆ ──────
       𓆩♡𓆪 *PUPPY-X* 𓆩♡𓆪
       _Silent Power. Pure Control._
`;

    await client.sendMessage(from, {
      text: menu,
      contextInfo: {
        mentionedJid: [mek.sender],
        externalAdReply: {
          title: "𓆩 PUPPY-X 𓆪",
          body: `Owner: ${name} ♛`,
          thumbnailUrl: MENU_IMAGE,
          sourceUrl: "https://github.com",
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: mek });

  } catch (error) {
    console.error(error);
    reply("❌ Menu failed to load.");
  }
});

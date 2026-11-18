const { keith } = require('../commandHandler');
const activeMenus = new Map();

const commandList = {};
let totalCommands = 0;

function initializeCommands() {
  if (Object.keys(commandList).length === 0) {
    const commands = require('../commandHandler').commands;
    totalCommands = commands.filter(cmd => !cmd.dontAddCommandList).length;
    commands.forEach((cmd) => {
      const category = cmd.category?.toUpperCase() || 'UNCATEGORIZED';
      if (!commandList[category]) commandList[category] = [];
      commandList[category].push(cmd.pattern);
    });
  }
}

function getCategoryCommands(categories, selectedNumber) {
  const selectedCategory = categories?.[selectedNumber - 1];
  if (!selectedCategory) {
    return {
      text: null,
      category: null
    };
  }

  const commandsInCategory = commandList[selectedCategory] || [];

  return {
    text:
      `╭══════════════════✦\n` +
      `│ 📂 *CATEGORY:* ${selectedCategory}\n` +
      `├══════════════════✦\n` +
      commandsInCategory.map((cmd, idx) => `│ 📌 ${idx + 1}. ${cmd}`).join("\n") +
      `\n├══════════════════✦\n` +
      `│ 📊 *Total Commands:* ${commandsInCategory.length}\n` +
      `╰══════════════════✦`,
    category: selectedCategory
  };
}

keith({
  pattern: "menu",
  category: "general",
  description: "Interactive category-based menu for PUPPY-X"
},
async (from, client, conText) => {
  const { mek, pushName, sourceUrl } = conText;
  const userId = mek.sender;
  const botname = "PUPPY-X";
  const botPic = "https://h.uguu.se/JaoRuOdMRHkV.jpg";

  if (activeMenus.has(userId)) {
    const { handler } = activeMenus.get(userId);
    client.ev.off("messages.upsert", handler);
    activeMenus.delete(userId);
  }

  initializeCommands();

  const categories = Object.keys(commandList);

  const menuText = `👋 Hello *${pushName}*,

╔══════════════════✦
║ 🤖 *BOT NAME:* ${botname}
║ ⚡ *TOTAL PLUGINS:* ${totalCommands}
║ 👑 *PREFIX:* Interactive
╚══════════════════✦

╭════  🔥 *MENU CATEGORIES*  ════╮
│ 💬 *Please reply with a number:*
├─────────────────────────
${categories.map((cat, i) => `│  ${i + 1} ➔ ${cat}`).join("\n")}
╰─────────────────────────╯
> *💡 Tip: Reply '0' to return to the main menu.*`.trim();

  const sentMessage = await client.sendMessage(from, {
    text: menuText,
    contextInfo: {
      mentionedJid: [mek.sender],
      externalAdReply: {
        title: `${botname} - Modern Interactive Menu`,
        body: `Explore ${totalCommands} powerful commands!`,
        thumbnailUrl: botPic,
        sourceUrl: sourceUrl || "https://github.com",
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  });

  const replyHandler = async (update) => {
    const message = update.messages?.[0];
    if (!message?.message?.extendedTextMessage || message.key.remoteJid !== from) return;

    const response = message.message.extendedTextMessage;
    const isReplyToMenu = response.contextInfo?.stanzaId === sentMessage.key.id;
    const isReplyToCategory = activeMenus.get(userId)?.lastCategoryMessage === message.key.id;
    if (!isReplyToMenu && !isReplyToCategory) return;

    const userInput = response.text.trim();
    const selectedNumber = parseInt(userInput);

    if (userInput === "0") {
      await client.sendMessage(from, { 
        text: menuText,
        contextInfo: {
          externalAdReply: {
            title: `${botname} - Main Menu`,
            body: `Select a category below`,
            thumbnailUrl: botPic,
            sourceUrl: sourceUrl || "https://github.com",
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      });
      activeMenus.set(userId, {
        sentMessage,
        handler: replyHandler,
        lastCategoryMessage: null
      });
      return;
    }

    if (isNaN(selectedNumber) || selectedNumber < 1 || selectedNumber > categories.length) {
      console.log(`Invalid menu input from ${userId}: "${userInput}"`);
      return;
    }

    const { text: commandsText } = getCategoryCommands(categories, selectedNumber);
    if (!commandsText) {
      console.log(`menu: No category found for input ${selectedNumber}`);
      return;
    }

    const categoryMessage = await client.sendMessage(from, {
      text: commandsText,
      contextInfo: {
        mentionedJid: [mek.sender],
        externalAdReply: {
          title: `${botname} » ${categories[selectedNumber - 1]}`,
          body: `Total: ${commandList[categories[selectedNumber - 1]]?.length || 0} commands`,
          thumbnailUrl: botPic,
          sourceUrl: sourceUrl || "https://github.com",
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    });

    activeMenus.set(userId, {
      sentMessage,
      handler: replyHandler,
      lastCategoryMessage: categoryMessage.key.id
    });
  };

  client.ev.on("messages.upsert", replyHandler);
  activeMenus.set(userId, {
    sentMessage,
    handler: replyHandler,
    lastCategoryMessage: null
  });

  setTimeout(() => {
    if (activeMenus.has(userId)) {
      client.ev.off("messages.upsert", activeMenus.get(userId).handler);
      activeMenus.delete(userId);
    }
  }, 600000);
});

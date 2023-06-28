require("dotenv").config();
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const Moralis = require("moralis").default;

const API_KEY =
  "oTYn0f5pNUHXTNgtSsDMtohMoPMB855Oocd4AIHHBosAhDh2EdlRwuzHRHsTmAue";
const BOT_TOKEN = "6037367050:AAH8c2JFfqJPQvDnsisWaXnYrHf1XBUTXUY";
const TICKET_TOKEN = "6011693453:AAH70_aQIzYTWj7JNm1i7CuiqyO3MqPGPnY";

// Initialize Moralis
Moralis.start({ apiKey: API_KEY }).then(console.log);

// Create a new instance of the TelegramBot with your bot token
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

function deleteBotMessage(ticketBot, msg, isBot) {
  ticketBot
    .deleteMessage(msg.chat.id, msg.message_id)
    .then(() => {
      console.log("Message deleted");
    })
    .catch((err) => {
      console.error("Failed to delete message: ", err);
    });
}
function deleteAndKickBot(ticketBot, msg, isBot) {
  ticketBot
    .deleteMessage(msg.chat.id, msg.message_id)
    .then(() => {
      ticketBot
        .kickChatMember(msg.chat.id, msg.from.id)
        .then(() => {
          console.log("Bot has been kicked from the chat");
        })
        .catch((err) => {
          console.error("Failed to kick the bot: ", err);
        });
      console.log("Message deleted");
    })
    .catch((err) => {
      console.error("Failed to delete message: ", err);
    });
}

// Fetch token data
async function gettoken() {
  try {
    const response = await Moralis.EvmApi.token.getTokenPrice({
      chain: "0x1",
      address: "0xa5ebe5507b6c725cbc283f8ade236fe8b8d41f91",
    });

    const data = response.raw;
    const ethPrice =
      parseFloat(data.nativePrice.value) /
      Math.pow(10, data.nativePrice.decimals);

    return {
      address: data.tokenAddress,
      eth: Number(ethPrice).toFixed(18),
      usd: Number(data.usdPriceFormatted).toFixed(12),
      supply: "420 Trillion ",
      symbol: data.tokenSymbol,
    };
  } catch (e) {
    console.error(e);
  }
}

// Helper function to send token details
async function sendtoken(chatId) {
  const token = await gettoken();

  if (token) {
    bot.sendMessage(
      chatId,
      `🍀 ERC-20 Token Freshly launched\n\n` +
        `📄 Contract: ${token.address}\n` +
        `💵 ${token.eth} ETH ($${token.usd}) \n` +
        `🪙 ${token.supply} 420chan\n` +
        `🔹 https://bit.ly/420ChanDexTools\n\n` +
        `🔼 Low Market Cap\n` +
        `🐦 TW: @420chan_token\n` +
        `📱 TikTok: @420chan_token\n`
    );
  }
}

// Set Interval to send token details every hour
setInterval(() => sendtoken("-1001719064596"), 60 * 60 * 1000);

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpText = [
    "/rules - Get information about the group rules",
    "/help - Get the list of commands",
  ].join("\n");

  bot.sendMessage(chatId, "Available commands:\n\n" + helpText);
});

bot.onText(/\/rules/, (msg) => {
  const chatId = msg.chat.id;
  const rules =
    "🪴 Welcome To The Official 420chan Channel\n" +
    "📕 Follow The Rules Or Get Banned\n" +
    "🚫 Spam\n" +
    "🚫 Scam\n" +
    "🚫 Disrespect";

  bot.sendMessage(chatId, rules);
});

const botsToKeep = [
  "@Bobby_Bot_Trending",
  "Bobby_Bot_Trending",
  "@BobbyBuyBot",
  "BobbyBuyBot",
  "@Token_420chan_Bot",
  "Token_420chan_Bot",
];

bot.on("message", (msg) => {
  const isBot = msg.from.is_bot ?? false;
  if (isBot && !botsToKeep.includes(msg.from.username)) {
    bot
      .deleteMessage(msg.chat.id, msg.message_id)
      .then(() => {
        console.log("Message deleted");
        bot
          .kickChatMember(msg.chat.id, msg.from.id)
          .then(() => {
            console.log("Bot has been kicked from the chat");
          })
          .catch((err) => {
            console.error("Failed to kick the bot: ", err);
          });
      })
      .catch((err) => {
        console.error("Failed to delete message: ", err);
      });
  } else {
    consolebotsToKeep("not a bot ... in on message main group");
  }
});

const ticketBot = new TelegramBot(TICKET_TOKEN, {
  polling: true,
});

const tickets = new Map();

const toKeepTicketsBot = ["chan_420TicketBot", "@chan_420TicketBot"];

ticketBot.on("message", (msg) => {
  // Check if the message is from a bot
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  const fromId = msg.from.id;
  const username = msg.from.username;
  const isBot = msg.from.is_bot ?? false;

  if (isBot && !toKeepTicketsBot.includes(username)) {
    // Delete the message
    ticketBot
      .deleteMessage(msg.chat.id, msg.message_id)
      .then(() => {
        console.log("Message deleted");
        ticketBot
          .kickChatMember(msg.chat.id, msg.from.id)
          .then(() => {
            console.log("Bot has been kicked from the chat");
          })
          .catch((err) => {
            console.error("Failed to kick the bot: ", err);
          });
        console.log("Message deleted");
      })
      .catch((err) => {
        console.error("Failed to delete message: ", err);
      });
  } else {
    console.log("not a bot ... in on message");
  }
});
function generateTicket(msg) {
  const chatId = msg.chat.id;
  const username = msg.from.username || msg.from.first_name;
  const isBot = msg.from.is_bot ?? false;

  if (isBot && !toKeepTicketsBot.includes(username)) {
    ticketBot
      .deleteMessage(chatId, messageId)
      .then(() => {
        console.log("is bot");
        console.log("Message deleted");
      })
      .catch((err) => {
        console.error("Failed to delete message: ", err);
      });
  } else {
    console.log("generating ticket not a bot");

    ticketBot.sendMessage(
      chatId,
      `Hello ${username}, welcome to 4chan Token! To join our Official Group you need to be verified. Please click the button below to generate a ticket.`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Generate Ticket", callback_data: "generate_ticket" }],
          ],
        },
      }
    );

    setTimeout(() => {
      if (!tickets.has(chatId)) {
        ticketBot.sendMessage(chatId, "Time expired! Please try again.");
      }
    }, 45000);
  }
}

ticketBot.onText(/\/ticket/, generateTicket);

ticketBot.on("new_chat_members", generateTicket);

ticketBot.on("callback_query", async (query) => {
  if (query.data === "generate_ticket") {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const fromId = query.message.from.id;

    const ticket = generateUniqueTicket();
    tickets.set(chatId, ticket);

    const isBot = query.message.from.is_bot ?? false;
    const username =
      query.message.from.username || query.message.from.first_name;
    // msg.from.is_bot ??

    if (isBot && !toKeepTicketsBot.includes(username)) {
      ticketBot
        .deleteMessage(chatId, messageId)
        .then(() => {
          ticketBot
            .kickChatMember(chatId, fromId)
            .then(() => {
              console.log("Bot has been kicked from the chat");
            })
            .catch((err) => {
              console.error("Failed to kick the bot: ", err);
            });
          console.log("Message deleted");
        })
        .catch((err) => {
          console.error("Failed to delete message: ", err);
        });
    } else {
      try {
        await ticketBot.sendMessage(chatId, `New Ticket Generated: ${ticket}`);
        await ticketBot.answerCallbackQuery(
          query.id,
          "Redirecting you to the main group..."
        );

        const msg = await ticketBot.sendMessage(
          chatId,
          "Please Join 420chan official group here: https://t.me/official_420chan_group"
        );

        const mainGroupId = "-1001719064596"; // Replace with the chat ID of the main group
        await ticketBot.sendMessage(
          mainGroupId,
          `Welcome To 420chan Telegram /help /rules`
        );

        await ticketBot.deleteMessage(chatId, messageId);
      } catch (error) {
        console.error(`Error while handling callback query: ${error.message}`);
      }
    }
  }
});

function generateUniqueTicket() {
  return Math.random().toString(36).substring(2, 10);
}
const app = express();

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  bot.startPolling();
  ticketBot.startPolling();
  console.log(`Server running on port ${port}`);
});

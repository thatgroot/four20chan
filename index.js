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
      supply: "420000000000000000000000000000000 ",
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
        `🪙 ${token.supply} 420CHAN\n` +
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
    "🪴 Welcome To The Official 420Chan Channel\n" +
    "📕 Follow The Rules Or Get Banned\n" +
    "🚫 Spam\n" +
    "🚫 Scam\n" +
    "🚫 Disrespect";

  bot.sendMessage(chatId, rules);
});

// Removed bot.once("message") event as it was only used once at the beginning and not used in any other bot.onText events.

const ticketBot = new TelegramBot(TICKET_TOKEN, {
  polling: true,
});

const tickets = new Map();

ticketBot.onText(/\/ticket/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username || msg.from.first_name;

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
});

ticketBot.on("callback_query", async (query) => {
  if (query.data === "generate_ticket") {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;

    const ticket = generateUniqueTicket();
    tickets.set(chatId, ticket);

    try {
      await ticketBot.sendMessage(chatId, `New Ticket Generated: ${ticket}`);
      await ticketBot.answerCallbackQuery(
        query.id,
        "Redirecting you to the main group..."
      );

      const msg = await ticketBot.sendMessage(
        chatId,
        "Please Join 420CHAN Group here: https://t.me/+-WPFpGOCbihhMmM0"
      );

      const mainGroupId = "-1001719064596"; // Replace with the chat ID of the main group
      await ticketBot.sendMessage(
        mainGroupId,
        `Welcome To Pickly Telegram /help /rules`
      );

      await ticketBot.deleteMessage(chatId, messageId);
    } catch (error) {
      console.error(`Error while handling callback query: ${error.message}`);
    }
  }
});

function generateUniqueTicket() {
  return Math.random().toString(36).substring(2, 10);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  // Start the main bot
  bot.startPolling();

  // Start the ticket bot
  ticketBot.startPolling();
  console.log(`Server running on port ${port}`);
});

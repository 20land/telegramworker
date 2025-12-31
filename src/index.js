const BOT_TOKEN = "8330482066:AAGcObeIrOnJ3cKgyIlTWriN0jAETMjbffo";
const WEBAPP_URL = "https://20landshop.ir/telegram";

async function sendMessage(chatId, text, replyMarkup) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "HTML",
      reply_markup: replyMarkup,
    }),
  });
}

function getMainMenu() {
  return {
    keyboard: [
      [
        {
          text: "🎁 مشاوره رایگان",
          web_app: { url: `${WEBAPP_URL}` },
        },
        { text: "📞 تماس با ما" },
      ],
    ],
    resize_keyboard: true,
    is_persistent: true,
  };
}

function getInlineMenu() {
  return {
    inline_keyboard: [
      [
        {
          text: "🎁 مشاوره رایگان",
          web_app: { url: `${WEBAPP_URL}` },
        },
      ],
      [{ text: "📞 تماس: 02191009893", url: "tel:02191009893" }],
    ],
  };
}

export default {
  async fetch(request) {
    if (request.method === "GET") {
      return new Response("Telegram Bot is running!");
    }

    try {
      const update = await request.json();
      const message = update.message;

      if (!message) {
        return new Response("OK");
      }

      const chatId = message.chat.id;
      const text = message.text || "";
      const firstName = message.from?.first_name || "کاربر";

      if (text === "/start") {
        await sendMessage(
          chatId,
          `سلام <b>${firstName}</b> عزیز! 👋\n\nبه <b>بیستلند شاپ</b> خوش آمدید 🌟\n\nاز منوی زیر انتخاب کنید 👇`,
          getMainMenu()
        );
        return new Response("OK");
      }

      if (text === "/menu") {
        await sendMessage(chatId, "📋 منوی اصلی:", getMainMenu());
        return new Response("OK");
      }

      if (text === "/help") {
        await sendMessage(
          chatId,
          `📖 <b>راهنما:</b>\n\n/start - شروع\n/menu - منو\n/help - راهنما`,
          getMainMenu()
        );
        return new Response("OK");
      }

      if (text === "📞 تماس با ما") {
        await sendMessage(
          chatId,
          `📞 راه‌های ارتباطی:\n\n☎️ شماره تماس:\n<code>02191009893</code>\n\n👆 روی شماره بزنید تا کپی شود`,
          getMainMenu()
        );
        return new Response("OK");
      }

      // پیام پیش‌فرض
      await sendMessage(
        chatId,
        `از منو استفاده کنید یا /start بزنید.`,
        getMainMenu()
      );

      return new Response("OK");
    } catch (error) {
      console.error("Error:", error);
      return new Response("OK");
    }
  },
};

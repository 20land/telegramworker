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
      // [
      //   {
      //     text: "💇 خدمات مو",
      //     web_app: { url: `${WEBAPP_URL}?landing=miniapp_3` },
      //   },

      // ],
      // [{ text: "📍 آدرس کلینیک" }, { text: "❓ سوالات متداول" }],
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
      [{ text: "📞 تماس با ما" }],
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
      } else if (text === "/menu") {
        await sendMessage(chatId, "📋 منوی اصلی:", getMainMenu());
      } else if (text === "/services") {
        await sendMessage(chatId, "🌟 <b>خدمات ما:</b>", getInlineMenu());
      } else if (text === "/help") {
        await sendMessage(
          chatId,
          `📖 <b>راهنما:</b>\n\n/start - شروع\n/menu - منو\n/help - راهنما`,
          getMainMenu()
        );
      } else if (text === "📞 تماس با ما") {
        await sendMessage(
          chatId,
          `📞 <b>راه‌های ارتباطی:</b>\n\n☎️ برای تماس روی دکمه زیر کلیک کنید:`,
          {
            inline_keyboard: [
              [{ text: "📞 تماس: 021-9100-9893", url: "tel:02191009893" }],
            ],
          }
        );
      }
      //  else if (text === "📍 آدرس کلینیک") {
      //   await sendMessage(
      //     chatId,
      //     `📍 <b>آدرس:</b>\n\nتهران، خیابان ولیعصر، ...`,
      //     getMainMenu()
      //   );
      // }
      else if (text === "❓ سوالات متداول") {
        await sendMessage(
          chatId,
          `❓ <b>سوالات متداول:</b>\n\n<b>مشاوره رایگانه؟</b>\nبله، کاملاً رایگان!`,
          getMainMenu()
        );
      } else {
        await sendMessage(
          chatId,
          `از منو استفاده کنید یا /start بزنید.`,
          getMainMenu()
        );
      }

      return new Response("OK");
    } catch (error) {
      console.error("Error:", error);
      return new Response("OK");
    }
  },
};

import axios from 'axios';

export const sendTelegramMessage = async (req, res) => {
  try {
    const { message, chatId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!chatId) {
      return res.status(400).json({ error: "Chat ID is required" });
    }

    // Telegram Bot API endpoint
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return res.status(500).json({ 
        error: "Telegram bot token not configured",
        details: "Please set TELEGRAM_BOT_TOKEN in environment variables"
      });
    }

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await axios.post(telegramUrl, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    });

    return res.status(200).json({
      message: "Message sent successfully",
      messageId: response.data.result.message_id,
      success: true
    });
  } catch (error) {
    return res.status(500).json({ 
      error: "Failed to send Telegram message",
      details: error.message 
    });
  }
};

export const getTelegramUpdates = async (req, res) => {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return res.status(500).json({ 
        error: "Telegram bot token not configured"
      });
    }

    const telegramUrl = `https://api.telegram.org/bot${botToken}/getUpdates`;
    const response = await axios.get(telegramUrl);

    return res.status(200).json({
      updates: response.data.result,
      success: true
    });
  } catch (error) {
    return res.status(500).json({ 
      error: "Failed to get Telegram updates",
      details: error.message 
    });
  }
};

export const openTelegramChat = async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    // Generate Telegram deep link
    const telegramUrl = `https://t.me/${username}`;
    
    return res.status(200).json({
      url: telegramUrl,
      message: "Telegram chat link generated",
      success: true
    });
  } catch (error) {
    return res.status(500).json({ 
      error: "Failed to generate Telegram link",
      details: error.message 
    });
  }
};

// Quick response templates
export const getQuickResponses = async (req, res) => {
  try {
    const quickResponses = [
      {
        id: 1,
        category: "greeting",
        text: "Hello! How can I help you today?",
        emoji: "👋"
      },
      {
        id: 2,
        category: "help",
        text: "I'm here to assist you with search, calculations, tasks, and more!",
        emoji: "🤝"
      },
      {
        id: 3,
        category: "math",
        text: "I can solve math problems! Try: solve 15*8+32/4",
        emoji: "🧮"
      },
      {
        id: 4,
        category: "weather",
        text: "I can check weather for any city! Try: weather in Mumbai",
        emoji: "🌤️"
      },
      {
        id: 5,
        category: "joke",
        text: "Want to hear a joke? Just ask me!",
        emoji: "😄"
      },
      {
        id: 6,
        category: "task",
        text: "I can manage your tasks! Try: add task 'Buy groceries'",
        emoji: "✅"
      },
      {
        id: 7,
        category: "telegram",
        text: "I can open Telegram chats! Try: open telegram @username",
        emoji: "📱"
      }
    ];

    return res.status(200).json({
      quickResponses,
      success: true
    });
  } catch (error) {
    return res.status(500).json({ 
      error: "Failed to get quick responses",
      details: error.message 
    });
  }
};

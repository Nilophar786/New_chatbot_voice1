import axios from 'axios';

export const getJoke = async (req, res) => {
  try {
    // Mock jokes for now
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "Why did the scarecrow win an award? He was outstanding in his field!",
      "Why don't eggs tell jokes? They'd crack each other up!",
      "What do you call a fake noodle? An impasta!",
      "Why did the math book look so sad? Because it had too many problems!"
    ];

    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];

    return res.status(200).json({
      joke: randomJoke,
      success: true
    });
  } catch (error) {
    return res.status(500).json({ 
      error: "Failed to get joke",
      details: error.message 
    });
  }
};

export const getQuote = async (req, res) => {
  try {
    // Mock quotes for now
    const quotes = [
      {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
      },
      {
        text: "Innovation distinguishes between a leader and a follower.",
        author: "Steve Jobs"
      },
      {
        text: "Life is what happens to you while you're busy making other plans.",
        author: "John Lennon"
      },
      {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
      },
      {
        text: "It is during our darkest moments that we must focus to see the light.",
        author: "Aristotle"
      }
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    return res.status(200).json({
      quote: randomQuote,
      success: true
    });
  } catch (error) {
    return res.status(500).json({ 
      error: "Failed to get quote",
      details: error.message 
    });
  }
};

export const getFunFact = async (req, res) => {
  try {
    // Mock fun facts for now
    const facts = [
      "A group of flamingos is called a 'flamboyance'.",
      "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old!",
      "Octopuses have three hearts and blue blood.",
      "The shortest war in history was between Britain and Zanzibar in 1896. Zanzibar surrendered after 38 minutes.",
      "A single strand of spaghetti is called a 'spaghetto'.",
      "Bananas are berries, but strawberries aren't!",
      "The Eiffel Tower can be 15 cm taller during the summer due to thermal expansion.",
      "Sharks existed before trees."
    ];

    const randomFact = facts[Math.floor(Math.random() * facts.length)];

    return res.status(200).json({
      fact: randomFact,
      success: true
    });
  } catch (error) {
    return res.status(500).json({ 
      error: "Failed to get fun fact",
      details: error.message 
    });
  }
};

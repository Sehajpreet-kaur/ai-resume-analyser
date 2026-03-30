const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // ← pulled from .env
});

module.exports = groq;
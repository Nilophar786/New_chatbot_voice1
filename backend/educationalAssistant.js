import axios from "axios"

const educationalAssistantResponse = async (command, assistantName, userName) => {
  try {
    const apiKey = process.env.GEMINI_API_URL ? process.env.GEMINI_API_URL.split('key=')[1] : null
    const apiUrl = apiKey ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}` : null
    if (!apiUrl) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables")
    }
    
    const prompt = `You are an AI-powered educational assistant named ${assistantName} created by ${userName}. 
You are integrated into a voice assistant system to help students with learning.

Your role is to help students with learning by:
- Explaining concepts clearly in simple language
- Providing short summaries and definitions when asked
- Offering examples, analogies, and step-by-step solutions
- Answering questions from subjects like Computer Engineering, Mathematics, Science, and General Knowledge
- Giving motivational study tips and exam preparation strategies
- Keeping responses clear, concise, and engaging (voice-friendly)
- If a question is unclear, politely ask the user to rephrase
- Staying supportive, friendly, and encouraging toward learning
- Not generating irrelevant or unsafe content

Your task is to understand the user's educational query and respond with a JSON object like this:

{
  "type": "educational",
  "userInput": "<original user input>",
  "response": "<your educational response to read out loud to the user>"
}

Response guidelines:
- Keep responses voice-friendly and conversational
- Use simple, clear language appropriate for students
- Provide helpful explanations and examples
- Be encouraging and supportive
- If the question is unclear, politely ask for clarification
- Focus on educational content only

Important:
- Use ${userName} if someone asks who created you
- Only respond with the JSON object, nothing else

Now your userInput: ${command}
`

    const result = await axios.post(apiUrl, {
      "contents": [{
        "parts": [{"text": prompt}]
      }]
    })
    
    if (!result.data || !result.data.candidates || result.data.candidates.length === 0) {
      throw new Error("No candidates returned from Gemini API")
    }
    if (!result.data.candidates[0].content || !result.data.candidates[0].content.parts || result.data.candidates[0].content.parts.length === 0) {
      throw new Error("No content parts returned from Gemini API")
    }
    
    return result.data.candidates[0].content.parts[0].text
  } catch (error) {
    console.error("educationalAssistantResponse error:", error)
    throw error
  }
}

export default educationalAssistantResponse

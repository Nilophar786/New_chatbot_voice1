import translate from "translate";
import { exec } from "child_process";
import comprehensiveAssistantResponse from "../comprehensiveAssistant.js";

// Configure translate engine
translate.engine = "google";

export const processMultilingualCommand = async (req, res) => {
  try {
    const { text, userId, assistantName, userName } = req.body;

    if (!text) {
      return res.status(400).json({
        error: "Text input is required"
      });
    }

    // 1. Detect language automatically
    const detectedLang = await translate.detect(text);
    console.log(`Detected language: ${detectedLang} for text: "${text}"`);

    // 2. Translate text to English for processing
    const englishText = await translate(text, { to: "en" });
    console.log(`Translated to English: "${englishText}"`);

    // 3. Process command using existing AI assistant
    const aiResponse = await comprehensiveAssistantResponse(
      englishText,
      assistantName || "Assistant",
      userName || "User",
      userId
    );

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (e) {
      // If not JSON, wrap in response object
      parsedResponse = {
        type: "general",
        userInput: text,
        response: aiResponse
      };
    }

    // 4. Translate response back to detected language
    const replyInUserLang = await translate(parsedResponse.response, { to: detectedLang });
    console.log(`Translated response to ${detectedLang}: "${replyInUserLang}"`);

    // Normalize language code to base for gTTS compatibility
    const gttsLangCode = detectedLang.split('-')[0];

    // 5. Call Python script to speak the response
    try {
      exec(`python speak.py "${replyInUserLang.replace(/"/g, '\\"')}" "${gttsLangCode}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Speech synthesis error: ${error.message}`);
        } else {
          console.log(`Speech synthesis completed for language: ${gttsLangCode}`);
        }
      });
    } catch (speechError) {
      console.error("Error calling speech synthesis:", speechError);
      // Continue even if speech fails
    }

    // 6. Return response with language info
    res.json({
      reply: replyInUserLang,
      detectedLanguage: detectedLang,
      originalResponse: parsedResponse.response,
      type: parsedResponse.type || "general"
    });

  } catch (error) {
    console.error("Multilingual processing error:", error);
    res.status(500).json({
      error: "Failed to process multilingual command",
      details: error.message
    });
  }
};

// Comprehensive file descriptions for the entire project (Backend and Frontend)
// This file documents all files with English and Marathi descriptions

const fileDescriptions = [
  // Backend Configuration Files
  {
    path: "backend/package.json",
    english_description: "Backend package.json defines Node.js dependencies including Express, MongoDB, authentication libraries, AI integrations (Gemini, OpenAI), and various utility packages for the voice assistant application.",
    marathi_description: "बॅकएंड package.json Node.js अवलंबित्वे परिभाषित करतो ज्यामध्ये Express, MongoDB, प्रमाणीकरण लायब्ररी, AI एकत्रीकरण (Gemini, OpenAI) आणि व्हॉइस असिस्टंट ऍप्लिकेशनसाठी विविध युटिलिटी पॅकेजेस समाविष्ट आहेत."
  },
  {
    path: "backend/package-lock.json",
    english_description: "Lock file ensuring exact dependency versions for consistent backend environment across different installations.",
    marathi_description: "लॉक फाइल जी वेगवेगळ्या इंस्टॉलेशनमध्ये सुसंगत बॅकएंड वातावरणासाठी अचूक अवलंबित्व आवृत्त्या सुनिश्चित करतो."
  },
  {
    path: "backend/.gitignore",
    english_description: "Git ignore file specifying files and directories to exclude from version control, including node_modules, environment files, and build artifacts.",
    marathi_description: "Git दुर्लक्ष फाइल जी node_modules, पर्यावरण फाइल आणि बिल्ड आर्टिफॅक्ट्ससह आवृत्ती नियंत्रणातून वगळण्यासाठी फाइल आणि डिरेक्टरी निर्दिष्ट करतो."
  },
  {
    path: "backend/check-env.js",
    english_description: "Utility script to validate and check environment variables required for backend configuration and API keys.",
    marathi_description: "बॅकएंड कॉन्फिगरेशन आणि API कीसाठी आवश्यक पर्यावरण व्हेरिएबल्स प्रमाणित आणि तपासण्यासाठी युटिलिटी स्क्रिप्ट."
  },

  // Backend Main Files
  {
    path: "backend/index.js",
    english_description: "Main Express server entry point that sets up middleware, routes, CORS configuration, and starts the server with reminder scheduler functionality.",
    marathi_description: "मुख्य Express सर्व्हर प्रवेश बिंदू जो मिडलवेअर, रूट्स, CORS कॉन्फिगरेशन सेट करतो आणि रिमाइंडर शेड्युलर कार्यक्षमतेसह सर्व्हर सुरू करतो."
  },
  {
    path: "backend/gemini.js",
    english_description: "AI integration module handling Google Gemini API calls for natural language processing, voice commands, and predefined system operations like opening applications.",
    marathi_description: "Google Gemini API कॉल हाताळणारे AI एकत्रीकरण मॉड्यूल नैसर्गिक भाषा प्रक्रिया, व्हॉइस कमांड आणि ऍप्लिकेशन्स उघडण्यासारख्या पूर्वनिर्धारित सिस्टम ऑपरेशन्ससाठी."
  },
  {
    path: "backend/educationalAssistant.js",
    english_description: "Educational AI assistant module providing learning content, quizzes, and interactive educational features.",
    marathi_description: "शैक्षणिक AI सहायक मॉड्यूल जो शिकण्याचे सामग्री, क्विझ आणि इंटरॅक्टिव्ह शैक्षणिक वैशिष्ट्ये प्रदान करतो."
  },
  {
    path: "backend/comprehensiveAssistant.js",
    english_description: "Comprehensive AI assistant combining multiple functionalities including general queries, calculations, and system operations.",
    marathi_description: "सर्वसमावेशक AI सहायक जो सामान्य प्रश्न, गणना आणि सिस्टम ऑपरेशन्ससह अनेक कार्यक्षमता एकत्र करतो."
  },
  {
    path: "backend/speak.py",
    english_description: "Python script for text-to-speech functionality, likely using libraries like pyttsx3 for voice output in the assistant.",
    marathi_description: "टेक्स्ट-टू-स्पीच कार्यक्षमतेसाठी Python स्क्रिप्ट, सहायकामध्ये व्हॉइस आउटपुटसाठी pyttsx3 सारख्या लायब्ररी वापरत असण्याची शक्यता."
  },

  // Backend Configuration Directory
  {
    path: "backend/config/db.js",
    english_description: "Database configuration file managing MongoDB connection setup and environment-specific database connections.",
    marathi_description: "MongoDB कनेक्शन सेटअप आणि पर्यावरण-विशिष्ट डेटाबेस कनेक्शन व्यवस्थापित करणारी डेटाबेस कॉन्फिगरेशन फाइल."
  },
  {
    path: "backend/config/db-env.js",
    english_description: "Environment-specific database configuration for production or staging environments.",
    marathi_description: "प्रोडक्शन किंवा स्टेजिंग पर्यावरणांसाठी पर्यावरण-विशिष्ट डेटाबेस कॉन्फिगरेशन."
  },
  {
    path: "backend/config/db-local.js",
    english_description: "Local development database configuration for MongoDB connection during development.",
    marathi_description: "विकासादरम्यान MongoDB कनेक्शनसाठी स्थानिक विकास डेटाबेस कॉन्फिगरेशन."
  },
  {
    path: "backend/config/token.js",
    english_description: "JWT token generation and validation utilities for user authentication and session management.",
    marathi_description: "वापरकर्ता प्रमाणीकरण आणि सेशन व्यवस्थापनासाठी JWT टोकन जनरेशन आणि प्रमाणीकरण युटिलिटीज."
  },
  {
    path: "backend/config/cloudinary.js",
    english_description: "Cloudinary configuration for image upload, storage, and management in the application.",
    marathi_description: "ऍप्लिकेशनमध्ये प्रतिमा अपलोड, स्टोरेज आणि व्यवस्थापनासाठी Cloudinary कॉन्फिगरेशन."

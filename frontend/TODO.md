# Frontend Files Explanation

Below is a comprehensive explanation of all frontend files in the project. Each file is categorized and described in English, followed by a Marathi translation (मराठी अनुवाद).

## Configuration Files (Config Files)
These files handle project setup, build configuration, and development environment.

1. **package.json**  
   English: This file defines the project's dependencies, scripts, and metadata for the React application using Vite as the build tool. It includes libraries like React, Tailwind CSS, Framer Motion, Axios, and React Router for modern web development.  
   मराठी: हा फाइल प्रोजेक्टच्या अवलंबित्वे, स्क्रिप्ट आणि मेटाडेटा वर्णन करतो, जो Vite वापरून React ऍप्लिकेशनसाठी आहे. यात React, Tailwind CSS, Framer Motion, Axios आणि React Router सारख्या लायब्ररींचा समावेश आहे.

2. **vite.config.js**  
   English: Configuration file for Vite build tool, setting up plugins and build options for the React application.  
   मराठी: Vite बिल्ड टूलसाठी कॉन्फिगरेशन फाइल, जो React ऍप्लिकेशनसाठी प्लगइन्स आणि बिल्ड पर्याय सेट करतो.

3. **eslint.config.js**  
   English: ESLint configuration for code linting and maintaining code quality standards in the JavaScript/TypeScript codebase.  
   मराठी: JavaScript/TypeScript कोडबेसमध्ये कोड लिंटिंग आणि कोड गुणवत्ता मानके राखण्यासाठी ESLint कॉन्फिगरेशन.

4. **index.html**  
   English: The main HTML template file that serves as the entry point for the React application, containing the root div and basic meta tags.  
   मराठी: मुख्य HTML टेम्प्लेट फाइल जी React ऍप्लिकेशनसाठी प्रवेश बिंदू म्हणून काम करतो, ज्यामध्ये रूट div आणि मूलभूत मेटा टॅग आहेत.

5. **README.md**  
   English: Documentation file providing project overview, installation instructions, and usage guidelines.  
   मराठी: प्रोजेक्टचा आढावा, इंस्टॉलेशन सूचना आणि वापर मार्गदर्शक प्रदान करणारी दस्तऐवजीकरण फाइल.

6. **.gitignore**  
   English: Specifies files and directories that should be ignored by Git version control.  
   मराठी: Git आवृत्ती नियंत्रणाद्वारे दुर्लक्ष केले जाणारे फाइल आणि डिरेक्टरी निर्दिष्ट करतो.

## Main Application Files (Core Files)
Core files that bootstrap the React application.

7. **main.jsx**  
   English: Entry point JavaScript file that renders the React application into the DOM using ReactDOM.  
   मराठी: प्रवेश बिंदू JavaScript फाइल जी ReactDOM वापरून React ऍप्लिकेशनला DOM मध्ये रेंडर करतो.

8. **App.jsx**  
   English: Main React component that sets up routing and provides the overall application structure with context providers.  
   मराठी: मुख्य React घटक जो रूटिंग सेट करतो आणि संदर्भ प्रदात्यांसह संपूर्ण ऍप्लिकेशनची रचना प्रदान करतो.

9. **index.css**  
   English: Global CSS file containing Tailwind CSS imports and custom styles for the entire application.  
   मराठी: संपूर्ण ऍप्लिकेशनसाठी Tailwind CSS आयात आणि कस्टम शैली असलेली ग्लोबल CSS फाइल.

## Context and State Management
Files handling application state and context.

10. **UserContext.jsx**  
    English: React context provider managing user authentication state, API calls, and global application data like user information and assistant settings.  
    मराठी: React संदर्भ प्रदाता जो वापरकर्ता प्रमाणीकरण स्थिती, API कॉल आणि वापरकर्ता माहिती आणि सहायक सेटिंग्ज सारख्या ग्लोबल ऍप्लिकेशन डेटा व्यवस्थापित करतो.

## Pages (Application Views)
These are the main screen components users interact with.

11. **Home.jsx**  
    English: Main dashboard page featuring voice-controlled AI assistant interface with chat, voice commands, teacher lessons, weather integration, and various interactive modes.  
    मराठी: मुख्य डॅशबोर्ड पृष्ठ ज्यामध्ये व्हॉइस-कंट्रोल्ड AI सहायक इंटरफेस, चॅट, व्हॉइस कमांड, शिक्षक धडे, हवामान एकत्रीकरण आणि विविध इंटरॅक्टिव्ह मोड आहेत.

12. **SignIn.jsx**  
    English: User authentication page with email/password login form, remember me functionality, and animated background effects.  
    मराठी: वापरकर्ता प्रमाणीकरण पृष्ठ ज्यामध्ये ईमेल/पासवर्ड लॉगिन फॉर्म, मला लक्षात ठेवा कार्यक्षमता आणि ऍनिमेटेड पार्श्वभूमी प्रभाव आहेत.

13. **SignUp.jsx**  
    English: User registration page with form validation, password strength checker, terms acceptance, and animated UI elements.  
    मराठी: वापरकर्ता नोंदणी पृष्ठ ज्यामध्ये फॉर्म प्रमाणीकरण, पासवर्ड ताकद तपासणी, अटी स्वीकार आणि ऍनिमेटेड UI घटक आहेत.

14. **Customize.jsx**  
    English: Assistant customization page allowing users to select or upload avatar images for their AI assistant with animated card selection.  
    मराठी: सहायक कस्टमायझेशन पृष्ठ ज्यामध्ये वापरकर्त्यांना त्यांच्या AI सहायकासाठी अवतार प्रतिमा निवडण्याची किंवा अपलोड करण्याची परवानगी आहे, ऍनिमेटेड कार्ड निवडीसह.

15. **Customize2.jsx**  
    English: Second customization step where users name their AI assistant and finalize the setup process.  
    मराठी: दुसरा कस्टमायझेशन टप्पा जिथे वापरकर्ते त्यांच्या AI सहायकाला नाव देतात आणि सेटअप प्रक्रिया पूर्ण करतात.

16. **History.jsx**  
    English: Page displaying user's conversation history with search functionality, pinning options, and history management features.  
    मराठी: वापरकर्त्याच्या संभाषण इतिहासाचे प्रदर्शन करणारे पृष्ठ, शोध कार्यक्षमता, पिनिंग पर्याय आणि इतिहास व्यवस्थापन वैशिष्ट्यांसह.

## Components (Reusable UI Elements)
Modular components for building the user interface.

17. **HamburgerMenu.jsx**  
    English: Mobile navigation menu component with slide-in animation, logout and navigation options for responsive design.  
    मराठी: मोबाइल नेव्हिगेशन मेनू घटक ज्यामध्ये स्लाइड-इन ऍनिमेशन, लॉगआउट आणि प्रतिसादात्मक डिझाइनसाठी नेव्हिगेशन पर्याय आहेत.

18. **ImageWithLoading.jsx**  
    English: Image component with loading states, error handling, fallback images, and smooth transitions for better user experience.  
    मराठी: प्रतिमा घटक ज्यामध्ये लोडिंग स्थिती, त्रुटी हाताळणी, फॉलबॅक प्रतिमा आणि चांगल्या वापरकर्ता अनुभवासाठी सहज संक्रमण आहेत.

19. **LaunchAnimation.jsx**  
    English: Animated launch sequence component with progress bar, particle effects, and Jarvis-themed boot animation for app startup.  
    मराठी: ऍनिमेटेड लॉन्च क्रम घटक ज्यामध्ये प्रोग्रेस बार, पार्टिकल प्रभाव आणि ऍप स्टार्टअपसाठी Jarvis-थीम्ड बूट ऍनिमेशन आहे.

20. **LoadingAnimation.jsx**  
    English: Versatile loading animation component with multiple styles (spinner, dots, pulse, scan) and customizable colors/sizes.  
    मराठी: बहुमुखी लोडिंग ऍनिमेशन घटक ज्यामध्ये अनेक शैली (स्पिनर, डॉट्स, पल्स, स्कॅन) आणि कस्टमायझेबल रंग/आकार आहेत.

21. **ParticleBackground.jsx**  
    English: Animated particle background component with multiple presets (cyber, matrix, nebula) and customizable effects for visual appeal.  
    मराठी: ऍनिमेटेड पार्टिकल पार्श्वभूमी घटक ज्यामध्ये अनेक प्रीसेट (सायबर, मॅट्रिक्स, नेब्युला) आणि दृश्य आकर्षणासाठी कस्टमायझेबल प्रभाव आहेत.

22. **Card.jsx**  
    English: Reusable card component for displaying images with selection states and hover effects in the customization interface.  
    मराठी: पुनर्वापरयोग्य कार्ड घटक जो कस्टमायझेशन इंटरफेसमध्ये प्रतिमा प्रदर्शित करण्यासाठी निवड स्थिती आणि होवर प्रभावांसह आहे.

23. **ModernButton.jsx**  
    English: Styled button component with variants (primary, secondary, danger) and responsive design for consistent UI interactions.  
    मराठी: शैलीबद्ध बटण घटक ज्यामध्ये व्हेरिएंट (प्राथमिक, दुय्यम, धोका) आणि सुसंगत UI इंटरॅक्शनसाठी प्रतिसादात्मक डिझाइन आहे.

24. **ModernToggle.jsx**  
    English: Toggle switch component for switching between different application modes (dashboard, chatbot, voice).  
    मराठी: टॉगल स्विच घटक जो वेगवेगळ्या ऍप्लिकेशन मोडमध्ये (डॅशबोर्ड, चॅटबॉट, व्हॉइस) स्विच करण्यासाठी आहे.

25. **AnimatedAvatar.jsx**  
    English: Animated avatar component displaying the AI assistant's image with smooth transitions and loading states.  
    मराठी: ऍनिमेटेड अवतार घटक जो AI सहायकाची प्रतिमा सहज संक्रमण आणि लोडिंग स्थितींसह प्रदर्शित करतो.

26. **DynamicGreeting.jsx**  
    English: Component that displays personalized greetings based on time of day and user data with animated text effects.  
    मराठी: घटक जो दिवसाच्या वेळेनुसार आणि वापरकर्ता डेटावर आधारित वैयक्तिक अभिवादन ऍनिमेटेड मजकूर प्रभावांसह प्रदर्शित करतो.

27. **FloatingActions.jsx**  
    English: Floating action buttons for quick access to common functions like calculator, weather, and other tools.  
    मराठी: फ्लोटिंग ऍक्शन बटण्स जी कॅल्क्युलेटर, हवामान आणि इतर साधनांसारख्या सामान्य कार्यांसाठी जलद प्रवेशासाठी आहेत.

28. **SmartWidgetDashboard.jsx**  
    English: Main dashboard component with interactive widgets for various AI assistant functions and quick actions.  
    मराठी: मुख्य डॅशबोर्ड घटक ज्यामध्ये विविध AI सहायक कार्ये आणि जलद क्रियाांसाठी इंटरॅक्टिव्ह विजेट आहेत.

29. **WeatherModal.jsx**  
    English: Modal component for displaying weather information with loading states and error handling.  
    मराठी: हवामान माहिती प्रदर्शित करण्यासाठी मोडल घटक ज्यामध्ये लोडिंग स्थिती आणि त्रुटी हाताळणी आहे.

30. **TypingAnimation.jsx**  
    English: Text animation component simulating typing effect for AI responses and messages.  
    मराठी: मजकूर ऍनिमेशन घटक जो AI प्रतिसाद आणि संदेशांसाठी टायपिंग प्रभावाचे अनुकरण करतो.

31. **VoiceRingAnimation.jsx**  
    English: Animated ring component indicating voice recognition activity with pulsing effects.  
    मराठी: व्हॉइस रेकग्निशन क्रियाकलाप दर्शविण्यासाठी ऍनिमेटेड रिंग घटक ज्यामध्ये पल्सिंग प्रभाव आहेत.

32. **AchievementBadges.jsx**  
    English: Component displaying user achievement badges and progress indicators for gamification features.  
    मराठी: घटक जो वापरकर्ता यश बॅज आणि गेमिफिकेशन वैशिष्ट्यांसाठी प्रोग्रेस इंडिकेटर प्रदर्शित करतो.

33. **AmbientAudio.jsx**  
    English: Audio component providing ambient background sounds and audio controls for enhanced user experience.  
    मराठी: ऑडिओ घटक जो ऍम्बियंट पार्श्वभूमी आवाज आणि वर्धित वापरकर्ता अनुभवासाठी ऑडिओ नियंत्रणे प्रदान करतो.

34. **CandySagaGame.jsx**  
    English: Mini-game component implementing a candy matching game for entertainment within the application.  
    मराठी: मिनी-गेम घटक जो ऍप्लिकेशनमध्ये मनोरंजनासाठी कॅंडी मॅचिंग गेम लागू करतो.

35. **GlassmorphismCard.jsx**  
    English: Card component with glassmorphism design effects featuring transparency and blur for modern UI aesthetics.  
    मराठी: कार्ड घटक ज्यामध्ये ग्लासमॉर्फिझम डिझाइन प्रभाव आहेत, ज्यामध्ये पारदर्शकता आणि ब्लर आधुनिक UI सौंदर्यासाठी आहे.

36. **NeumorphismCard.jsx**  
    English: Card component implementing neumorphism design with soft shadows and embossed effects.  
    मराठी: कार्ड घटक जो न्यूमॉर्फिझम डिझाइन सॉफ्ट शॅडोज आणि एम्बॉस्ड प्रभावांसह लागू करतो.

37. **MicroAnimations.jsx**  
    English: Collection of small animation components for subtle UI enhancements and micro-interactions.  
    मराठी: लहान ऍनिमेशन घटकांचा संग्रह जो सूक्ष्म UI वर्धन आणि मायक्रो-इंटरॅक्शनसाठी आहे.

## Utilities (Utils)
Helper functions and utilities.

38. **popupUtils.js**  
    English: Utility functions for opening external links in popups with fallback handling for browser restrictions.  
    मराठी: बाह्य लिंक पॉपअपमध्ये उघडण्यासाठी युटिलिटी फंक्शन्स, ब्राउझर निर्बंधांसाठी फॉलबॅक हाताळणीसह.

## Assets (Media Files)
Static media resources used throughout the application.

39. **Various image files (.jpg, .png, .jpeg, .gif)**  
    English: Static image assets including AI assistant avatars, background images, UI icons, and visual elements used across the application.  
    मराठी: स्थिर प्रतिमा मालमत्ता ज्यामध्ये AI सहायक अवतार, पार्श्वभूमी प्रतिमा, UI आयकॉन आणि ऍप्लिकेशनमध्ये वापरलेले दृश्य घटक आहेत.

40. **Audio files**  
    English: Audio assets for ambient sounds, voice feedback, and interactive audio elements in the application.  
    मराठी: ऍप्लिकेशनमध्ये ऍम्बियंट आवाज, व्हॉइस फीडबॅक आणि इंटरॅक्टिव्ह ऑडिओ घटकांसाठी ऑडिओ मालमत्ता.

This comprehensive overview covers all frontend files in the React application, providing both English and Marathi explanations for better understanding across different user groups.

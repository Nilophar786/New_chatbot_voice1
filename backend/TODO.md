# Backend Files Explanation - Step by Step

This file explains all backend files in simple language. Each file is described in English and Marathi (मराठी).

## 1. Configuration Files

### backend/package.json
**English:** This file lists all the tools and libraries needed for the app. It includes things like Express for the server, MongoDB for data, and AI tools like Gemini.

**मराठी:** या फाइलमध्ये ऍपसाठी आवश्यक सर्व टूल आणि लायब्ररींची यादी आहे. यामध्ये सर्व्हरसाठी Express, डेटासाठी MongoDB आणि Gemini सारखी AI टूल समाविष्ट आहेत.

### backend/package-lock.json
**English:** This file locks the exact versions of tools so the app works the same everywhere. It prevents problems from different versions.

**मराठी:** या फाइलमध्ये टूलच्या अचूक आवृत्त्या लॉक केल्या आहेत जेणेकरून ऍप सर्वत्र समान काम करेल. वेगवेगळ्या आवृत्त्यांमुळे समस्या टाळतो.

### backend/.gitignore
**English:** This file tells Git which files to ignore. It keeps secret files and big folders out of the code repository.

**मराठी:** या फाइलमध्ये Git ला कोणत्या फाइल दुर्लक्षित करायच्या ते सांगितले आहे. गुप्त फाइल आणि मोठ्या फोल्डर कोड रेपॉजिटरीतून बाहेर ठेवतो.

### backend/check-env.js
**English:** This script checks if all needed settings are ready before the app starts. It looks for API keys and other important things.

**मराठी:** ऍप सुरू होण्यापूर्वी सर्व आवश्यक सेटिंग्ज तयार आहेत का ते या स्क्रिप्टमध्ये तपासले जाते. API की आणि इतर महत्त्वाच्या गोष्टी शोधतो.

## 2. Main Application Files

### backend/index.js
**English:** This is the main file that starts the server. It sets up rules, connects to the database, and handles reminders that send emails.

**मराठी:** सर्व्हर सुरू करणारी मुख्य फाइल आहे. नियम सेट करते, डेटाबेसशी जोडते आणि ईमेल पाठवणारे रिमाइंडर हाताळते.

### backend/gemini.js
**English:** This file connects to Google's Gemini AI. It helps the app understand voice commands and do tasks like opening apps.

**मराठी:** या फाइलमध्ये Google च्या Gemini AI शी कनेक्शन आहे. ऍपला व्हॉइस कमांड समजून ऍप उघडण्यासारखे काम करण्यास मदत करते.

### backend/educationalAssistant.js
**English:** This AI helper gives learning content and quizzes. It answers questions about education.

**मराठी:** हा AI मदतनीस शिकण्याचे सामग्री आणि क्विझ देतो. शिक्षणाबद्दलच्या प्रश्नांची उत्तरे देतो.

### backend/comprehensiveAssistant.js
**English:** This is a big AI helper that does many things like answering questions, doing math, and controlling the system.

**मराठी:** हा मोठा AI मदतनीस आहे जो प्रश्न उत्तरे देणे, गणित करणे आणि सिस्टम नियंत्रित करणे असे अनेक काम करतो.

### backend/speak.py
**English:** This Python file turns text into speech. It makes the app talk using voice.

**मराठी:** या Python फाइलमध्ये मजकूरला आवाजात रूपांतरित केले जाते. ऍपला बोलण्यासाठी आवाज वापरतो.

## 3. Configuration Directory (config/)

### backend/config/db.js
**English:** This file sets up the database connection. It connects to MongoDB and handles different environments.

**मराठी:** या फाइलमध्ये डेटाबेस कनेक्शन सेट केले आहे. MongoDB शी जोडते आणि वेगवेगळ्या पर्यावरण हाताळते.

### backend/config/db-env.js
**English:** This is for production database settings. It has settings for the live app.

**मराठी:** हे प्रोडक्शन डेटाबेस सेटिंग्जसाठी आहे. लाइव्ह ऍपसाठी सेटिंग्ज आहेत.

### backend/config/db-local.js
**English:** This is for local development database. It connects to the database on your computer.

**मराठी:** हे स्थानिक विकास डेटाबेससाठी आहे. तुमच्या कॉम्प्युटरवर डेटाबेसशी जोडते.

### backend/config/token.js
**English:** This handles login tokens. It creates and checks tokens for user security.

**मराठी:** या फाइलमध्ये लॉगिन टोकन हाताळले जातात. वापरकर्ता सुरक्षेसाठी टोकन तयार आणि तपासले जातात.

### backend/config/cloudinary.js
**English:** This sets up image storage in the cloud. It uploads and manages pictures.

**मराठी:** या फाइलमध्ये क्लाउडमध्ये प्रतिमा स्टोरेज सेट केले आहे. प्रतिमा अपलोड आणि व्यवस्थापित करते.

### backend/config/disposableDomains.js
**English:** This list blocks fake email addresses. It stops spam during sign-up.

**मराठी:** या यादीमध्ये बनावट ईमेल अडवले जातात. साइन-अप दरम्यान स्पॅम थांबवतो.

## 4. Controllers Directory (controllers/)

### backend/controllers/auth.controllers.js
**English:** This handles login and sign-up. It manages user passwords and security.

**मराठी:** या फाइलमध्ये लॉगिन आणि साइन-अप हाताळले जाते. वापरकर्ता पासवर्ड आणि सुरक्षा व्यवस्थापित करते.

### backend/controllers/autonomous.controllers.js
**English:** This controls automatic AI tasks. It makes the system work on its own.

**मराठी:** या फाइलमध्ये ऑटोमॅटिक AI टास्क नियंत्रित केले जातात. सिस्टमला स्वतःहून काम करायला लावते.

### backend/controllers/entertainment.controllers.js
**English:** This manages games and fun stuff. It handles entertainment requests.

**मराठी:** या फाइलमध्ये गेम आणि मजेदार गोष्टी व्यवस्थापित केल्या जातात. मनोरंजन विनंत्या हाताळते.

### backend/controllers/math.controllers.js
**English:** This does math calculations. It solves math problems and teaches math.

**मराठी:** या फाइलमध्ये गणित गणना केली जाते. गणित समस्या सोडवते आणि गणित शिकवते.

### backend/controllers/multilingual.controllers.js
**English:** This translates languages. It helps with different languages.

**मराठी:** या फाइलमध्ये भाषा अनुवाद केला जातो. वेगवेगळ्या भाषांमध्ये मदत करते.

### backend/controllers/productivity.controllers.js
**English:** This helps with tasks and schedules. It organizes daily work.

**मराठी:** या फाइलमध्ये टास्क आणि शेड्युल मदत करते. दैनंदिन काम आयोजित करते.

### backend/controllers/reminder.controllers.js
**English:** This sets up reminders. It sends alerts at the right time.

**मराठी:** या फाइलमध्ये रिमाइंडर सेट केले जातात. योग्य वेळी अलर्ट पाठवते.

### backend/controllers/search.controllers.js
**English:** This handles search. It finds information from different places.

**मराठी:** या फाइलमध्ये शोध हाताळला जातो. वेगवेगळ्या ठिकाणांहून माहिती शोधतो.

### backend/controllers/teacher.controllers.js
**English:** This teaches and helps with learning. It gives education answers.

**मराठी:** या फाइलमध्ये शिकवणे आणि शिकण्यात मदत होते. शिक्षण उत्तरे देते.

### backend/controllers/telegram.controllers.js
**English:** This connects to Telegram. It handles messages on Telegram.

**मराठी:** या फाइलमध्ये Telegram शी कनेक्शन आहे. Telegram वर मेसेज हाताळते.

### backend/controllers/user.controllers.js
**English:** This manages user profiles. It handles user settings and data.

**मराठी:** या फाइलमध्ये वापरकर्ता प्रोफाइल व्यवस्थापित केले जातात. वापरकर्ता सेटिंग्ज आणि डेटा हाताळते.

### backend/controllers/weather.controllers.js
**English:** This gives weather info. It tells about rain, sun, etc.

**मराठी:** या फाइलमध्ये हवामान माहिती दिली जाते. पाऊस, सूर्य इत्यादी सांगते.

## 5. Middlewares Directory (middlewares/)

### backend/middlewares/isAuth.js
**English:** This checks if users are logged in. It protects private pages.

**मराठी:** या फाइलमध्ये वापरकर्ते लॉग इन आहेत का ते तपासले जाते. खाजगी पेज संरक्षित करते.

### backend/middlewares/multer.js
**English:** This handles file uploads. It saves files sent by users.

**मराठी:** या फाइलमध्ये फाइल अपलोड हाताळला जातो. वापरकर्त्यांनी पाठवलेल्या फाइल जतन करतो.

## 6. Models Directory (models/)

### backend/models/user.model.js
**English:** This defines user data structure. It sets up how user info is stored.

**मराठी:** या फाइलमध्ये वापरकर्ता डेटा संरचना परिभाषित केली आहे. वापरकर्ता माहिती कशी स्टोर केली जाते ते सेट करते.

## 7. Routes Directory (routes/)

### backend/routes/auth.routes.js
**English:** This sets up login paths. It connects login requests to the right code.

**मराठी:** या फाइलमध्ये लॉगिन पथ सेट केले आहेत. लॉगिन विनंत्या योग्य कोडशी जोडते.

### backend/routes/autonomous.routes.js
**English:** This sets up paths for automatic tasks. It defines AI automation endpoints.

**मराठी:** या फाइलमध्ये ऑटोमॅटिक टास्कसाठी पथ सेट केले आहेत. AI ऑटोमेशन एंडपॉइंट परिभाषित करते.

### backend/routes/multilingual.routes.js
**English:** This sets up paths for languages. It handles translation requests.

**मराठी:** या फाइलमध्ये भाषांसाठी पथ सेट केले आहेत. अनुवाद विनंत्या हाताळते.

### backend/routes/user.routes.js
**English:** This sets up paths for user actions. It handles profile changes.

**मराठी:** या फाइलमध्ये वापरकर्ता कृतींसाठी पथ सेट केले आहेत. प्रोफाइल बदल हाताळते.

### backend/routes/weather.routes.js
**English:** This sets up paths for weather. It connects weather requests to the code.

**मराठी:** या फाइलमध्ये हवामानासाठी पथ सेट केले आहेत. हवामान विनंत्या कोडशी जोडते.

## 8. Utils Directory (utils/)

### backend/utils/emailUtils.js
**English:** This sends emails. It handles notifications and messages.

**मराठी:** या फाइलमध्ये ईमेल पाठवले जातात. सूचना आणि मेसेज हाताळते.

## 9. Other Directories

### backend/Jarvis/
**English:** This folder has Jarvis AI files. It may have special AI settings.

**मराठी:** या फोल्डरमध्ये Jarvis AI फाइल आहेत. विशेष AI सेटिंग्ज असू शकतात.

### backend/open/
**English:** This folder has files to open apps. It may have scripts to start programs.

**मराठी:** या फोल्डरमध्ये ऍप उघडण्यासाठी फाइल आहेत. प्रोग्राम सुरू करण्यासाठी स्क्रिप्ट असू शकतात.

### backend/public/
**English:** This folder has public files. It has images and documents anyone can see.

**मराठी:** या फोल्डरमध्ये पब्लिक फाइल आहेत. प्रतिमा आणि दस्तऐवज आहेत जे कोणीही पाहू शकते.

### backend/public/.gitkeep
**English:** This empty file keeps the folder in Git. It stops empty folders from being ignored.

**मराठी:** ही रिकामी फाइल फोल्डरला Git मध्ये ठेवते. रिकाम्या फोल्डर दुर्लक्षित होण्यापासून थांबवते.

---

## Summary
The backend is organized into folders for different jobs:
- **Config**: Settings for database and tools
- **Controllers**: Code for different features
- **Models**: Data structures
- **Routes**: Paths for requests
- **Middlewares**: Checks and helpers
- **Utils**: Extra tools

Each file helps build the voice assistant app with AI, user login, and many features.

**सारांश**
बॅकएंड वेगवेगळ्या कामांसाठी फोल्डरमध्ये आयोजित केला आहे:
- **कॉन्फिग**: डेटाबेस आणि टूलसाठी सेटिंग्ज
- **कंट्रोलर**: वेगवेगळ्या वैशिष्ट्यांसाठी कोड
- **मॉडेल**: डेटा संरचना
- **रूट्स**: विनंत्यांसाठी पथ
- **मिडलवेअर**: तपासणी आणि मदत
- **युटिल्स**: अतिरिक्त टूल

प्रत्येक फाइल व्हॉइस असिस्टंट ऍप तयार करण्यास मदत करते ज्यामध्ये AI, वापरकर्ता लॉगिन आणि अनेक वैशिष्ट्ये आहेत.

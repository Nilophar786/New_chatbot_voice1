import geminiResponse from "../gemini.js";
import User from "../models/user.model.js";

// Teacher roadmaps data
const teacherRoadmaps = {
  "english-teacher": {
    "module1": [
      "Parts of Speech (Nouns, Verbs, Adjectives, Adverbs)",
      "Tenses (Present, Past, Future, Continuous, Perfect)",
      "Sentence Structures (Simple, Compound, Complex)",
      "Active vs Passive Voice",
      "Direct & Indirect Speech"
    ],
    "module2": [
      "Common Words & Synonyms",
      "Idioms & Phrasal Verbs",
      "Collocations (e.g., 'make a decision', 'take a shower')",
      "Word Formation (prefixes, suffixes)"
    ],
    "module3": [
      "Greetings & Introductions",
      "Everyday Conversations (shopping, travel, work)",
      "Telephone/Video Call English",
      "Politeness & Formal/Informal tone"
    ],
    "module4": [
      "Paragraph Writing",
      "Letter & Email Writing",
      "Essay Writing",
      "Reports & Summaries"
    ],
    "module5": [
      "Pronunciation & Accent Practice",
      "Listening Comprehension",
      "Debate & Discussion Practice",
      "Storytelling & Public Speaking"
    ],
    "module6": [
      "Mini Quizzes",
      "Spoken English Role-play",
      "Final Assessment"
    ]
  },
  "fullstack-teacher": {
    "module1": [
      "HTML Structure (doctype, head, body)",
      "Text Formatting & Links",
      "Images, Lists, Tables",
      "Forms & Input Elements",
      "Semantic HTML (header, nav, article, footer)"
    ],
    "module2": [
      "Selectors, Colors, Fonts",
      "Box Model (margin, padding, border)",
      "Flexbox & Grid",
      "Positioning & Responsive Design (Media Queries)",
      "CSS Animations & Transitions"
    ],
    "module3": [
      "Variables, Data Types, Operators",
      "Functions & Loops",
      "Arrays & Objects",
      "DOM Manipulation",
      "Events & Forms Handling",
      "ES6 Features (let/const, arrow functions, promises)"
    ],
    "module4": [
      "React Basics (Components, JSX)",
      "Props & State",
      "Hooks (useState, useEffect)",
      "Event Handling in React",
      "Conditional Rendering & Lists",
      "React Router (navigation)",
      "Context API / Redux (state management)"
    ],
    "module5": [
      "Intro to Node.js (modules, npm)",
      "Creating Express Server",
      "REST API Basics",
      "Middleware & Routing",
      "Handling JSON & HTTP Requests"
    ],
    "module6": [
      "Relational DB (Postgres/MySQL) Basics",
      "NoSQL DB (MongoDB) Basics",
      "CRUD Operations (Create, Read, Update, Delete)",
      "Connecting Backend to Database"
    ],
    "module7": [
      "JWT Authentication",
      "User Login/Signup",
      "Hashing Passwords (bcrypt)",
      "Role-based Access Control"
    ],
    "module8": [
      "Git & GitHub Basics",
      "Deploy Frontend (Netlify/Vercel)",
      "Deploy Backend (Render/Heroku)",
      "Connect DB on Cloud (Mongo Atlas, Railway)",
      "CI/CD Basics"
    ],
    "module9": [
      "Build a Full Stack App (Example: Task Manager / Blog / E-Commerce Mini App)"
    ]
  }
};

// Teacher types configuration with roadmaps
const teacherTypes = [
  {
    id: "english-teacher",
    title: "English Teacher",
    description: "Learn grammar, speaking & writing.",
    category: "Education",
    icon: "📚",
    color: "from-blue-500 to-indigo-500",
    roadmap: teacherRoadmaps["english-teacher"],
    prompt: "You are an expert English teacher. Follow this structured roadmap: " + JSON.stringify(teacherRoadmaps["english-teacher"]) + ". Help the student progress through modules systematically. Provide clear explanations, examples, and practice exercises. Be encouraging and patient. Always reference the current module and lesson in your responses."
  },
  {
    id: "fullstack-teacher",
    title: "Full Stack Teacher",
    description: "HTML, CSS, JS, React, Node, Database.",
    category: "Programming",
    icon: "💻",
    color: "from-green-500 to-teal-500",
    roadmap: teacherRoadmaps["fullstack-teacher"],
    prompt: "You are an expert Full Stack mentor. Follow this structured roadmap: " + JSON.stringify(teacherRoadmaps["fullstack-teacher"]) + ". Teach step by step with practical examples in HTML, CSS, JavaScript, React, Node.js, Express, and databases. Provide code snippets, explain concepts clearly, and help with debugging. Be technical but patient. Always reference the current module and lesson in your responses."
  }
];

// Get all available teachers
export const getTeachers = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's progress for each teacher
    const teachersWithProgress = teacherTypes.map(teacher => {
      const progress = user.teacherProgress?.find(p => p.teacherId === teacher.id) || {
        lessonsCompleted: 0,
        totalLessons: 0,
        currentLevel: "Beginner",
        streak: 0,
        lastLessonDate: null
      };

      return {
        ...teacher,
        progress
      };
    });

    return res.status(200).json({
      teachers: teachersWithProgress,
      message: "Teachers retrieved successfully"
    });
  } catch (error) {
    console.error("getTeachers error:", error);
    return res.status(500).json({ message: "Failed to get teachers", error: error.message });
  }
};

// Start a lesson with a specific teacher
export const startTeacherLesson = async (req, res) => {
  try {
    const { teacherId, lessonType } = req.body;
    const userId = req.userId;

    if (!teacherId || !lessonType) {
      return res.status(400).json({ message: "Teacher ID and lesson type are required" });
    }

    const teacher = teacherTypes.find(t => t.id === teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize teacher progress if not exists
    if (!user.teacherProgress) {
      user.teacherProgress = [];
    }

    let teacherProgress = user.teacherProgress.find(p => p.teacherId === teacherId);
    if (!teacherProgress) {
      teacherProgress = {
        teacherId,
        lessonsCompleted: 0,
        totalLessons: 0,
        currentLevel: "Beginner",
        streak: 0,
        lastLessonDate: null
      };
      user.teacherProgress.push(teacherProgress);
    }

    // Generate lesson content based on teacher and lesson type
    const lessonPrompt = `${teacher.prompt}

Generate a ${lessonType} lesson for the user. Include:
1. Clear learning objectives
2. Key concepts with explanations
3. Practical examples
4. Practice exercises
5. Assessment questions

Format the response as JSON with this structure:
{
  "lesson": {
    "title": "Lesson title",
    "objectives": ["objective 1", "objective 2"],
    "content": "Detailed lesson content with examples",
    "exercises": ["exercise 1", "exercise 2"],
    "questions": ["question 1", "question 2"]
  }
}`;

    const result = await geminiResponse(lessonPrompt, "teacher-lesson");

    if (!result) {
      return res.status(500).json({ message: "Failed to generate lesson content" });
    }

    const jsonMatch = result.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      return res.status(500).json({ message: "Invalid lesson response format" });
    }

    let lessonData;
    try {
      lessonData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      return res.status(500).json({ message: "Failed to parse lesson data" });
    }

    // Update progress
    teacherProgress.totalLessons += 1;
    teacherProgress.lastLessonDate = new Date();

    // Update streak
    const today = new Date().toDateString();
    const lastLessonDate = teacherProgress.lastLessonDate ? new Date(teacherProgress.lastLessonDate).toDateString() : null;

    if (lastLessonDate === today) {
      // Same day, don't increment streak
    } else if (lastLessonDate === new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()) {
      // Consecutive day, increment streak
      teacherProgress.streak += 1;
    } else {
      // Streak broken, reset to 1
      teacherProgress.streak = 1;
    }

    await user.save();

    return res.status(200).json({
      teacher,
      lesson: lessonData.lesson,
      progress: teacherProgress,
      message: "Lesson started successfully"
    });
  } catch (error) {
    console.error("startTeacherLesson error:", error);
    return res.status(500).json({ message: "Failed to start lesson", error: error.message });
  }
};

// Submit lesson answers and get feedback
export const submitLessonAnswers = async (req, res) => {
  try {
    const { teacherId, lessonId, answers } = req.body;
    const userId = req.userId;

    if (!teacherId || !lessonId || !answers) {
      return res.status(400).json({ message: "Teacher ID, lesson ID, and answers are required" });
    }

    const teacher = teacherTypes.find(t => t.id === teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate feedback based on answers
    const feedbackPrompt = `${teacher.prompt}

Review the student's answers and provide detailed feedback:

Answers: ${JSON.stringify(answers)}

Provide:
1. Overall score (0-100)
2. Correct answers with explanations
3. Areas for improvement
4. Encouraging comments
5. Next steps or additional practice

Format as JSON:
{
  "feedback": {
    "score": 85,
    "correctAnswers": ["explanation 1", "explanation 2"],
    "improvements": ["area 1", "area 2"],
    "encouragement": "Great job!",
    "nextSteps": "Practice suggestions"
  }
}`;

    const result = await geminiResponse(feedbackPrompt, "lesson-feedback");

    if (!result) {
      return res.status(500).json({ message: "Failed to generate feedback" });
    }

    const jsonMatch = result.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      return res.status(500).json({ message: "Invalid feedback response format" });
    }

    let feedbackData;
    try {
      feedbackData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      return res.status(500).json({ message: "Failed to parse feedback data" });
    }

    // Update progress if score is good
    const teacherProgress = user.teacherProgress?.find(p => p.teacherId === teacherId);
    if (teacherProgress && feedbackData.feedback.score >= 70) {
      teacherProgress.lessonsCompleted += 1;

      // Update level based on progress
      if (teacherProgress.lessonsCompleted >= 10) {
        teacherProgress.currentLevel = "Advanced";
      } else if (teacherProgress.lessonsCompleted >= 5) {
        teacherProgress.currentLevel = "Intermediate";
      }
    }

    await user.save();

    return res.status(200).json({
      teacher,
      feedback: feedbackData.feedback,
      progress: teacherProgress,
      message: "Lesson submitted successfully"
    });
  } catch (error) {
    console.error("submitLessonAnswers error:", error);
    return res.status(500).json({ message: "Failed to submit lesson", error: error.message });
  }
};

// Get user's progress for all teachers
export const getTeacherProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const progress = user.teacherProgress || [];

    return res.status(200).json({
      progress,
      message: "Progress retrieved successfully"
    });
  } catch (error) {
    console.error("getTeacherProgress error:", error);
    return res.status(500).json({ message: "Failed to get progress", error: error.message });
  }
};

// Get teacher roadmap
export const getTeacherRoadmap = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const userId = req.userId;

    if (!teacherId) {
      return res.status(400).json({ message: "Teacher ID is required" });
    }

    const teacher = teacherTypes.find(t => t.id === teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's current progress for this teacher
    const teacherProgress = user.teacherProgress?.find(p => p.teacherId === teacherId);
    const currentModule = teacherProgress?.currentModule || "module1";
    const currentLessonIndex = teacherProgress?.currentLessonIndex || 0;

    return res.status(200).json({
      teacher,
      roadmap: teacher.roadmap,
      currentProgress: {
        currentModule,
        currentLessonIndex,
        currentLesson: teacher.roadmap[currentModule]?.[currentLessonIndex] || null
      },
      message: "Teacher roadmap retrieved successfully"
    });
  } catch (error) {
    console.error("getTeacherRoadmap error:", error);
    return res.status(500).json({ message: "Failed to get teacher roadmap", error: error.message });
  }
};

// Start lesson from roadmap
export const startRoadmapLesson = async (req, res) => {
  try {
    const { teacherId, moduleId, lessonIndex } = req.body;
    const userId = req.userId;

    if (!teacherId || !moduleId) {
      return res.status(400).json({ message: "Teacher ID and module ID are required" });
    }

    const teacher = teacherTypes.find(t => t.id === teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize teacher progress if not exists
    if (!user.teacherProgress) {
      user.teacherProgress = [];
    }

    let teacherProgress = user.teacherProgress.find(p => p.teacherId === teacherId);
    if (!teacherProgress) {
      teacherProgress = {
        teacherId,
        lessonsCompleted: 0,
        totalLessons: 0,
        currentLevel: "Beginner",
        streak: 0,
        lastLessonDate: null,
        currentModule: "module1",
        currentLessonIndex: 0
      };
      user.teacherProgress.push(teacherProgress);
    }

    // Update current position in roadmap
    teacherProgress.currentModule = moduleId;
    teacherProgress.currentLessonIndex = lessonIndex || 0;

    const currentLesson = teacher.roadmap[moduleId]?.[lessonIndex || 0];
    if (!currentLesson) {
      return res.status(404).json({ message: "Lesson not found in roadmap" });
    }

    // Generate lesson content based on roadmap position
    const lessonPrompt = `${teacher.prompt}

Current Position: ${moduleId} → Lesson ${lessonIndex + 1}: ${currentLesson}

Generate a detailed lesson for this specific topic. Include:
1. Clear learning objectives
2. Key concepts with explanations
3. Practical examples
4. Practice exercises
5. Assessment questions

Format the response as JSON with this structure:
{
  "lesson": {
    "title": "${currentLesson}",
    "module": "${moduleId}",
    "lessonIndex": ${lessonIndex || 0},
    "objectives": ["objective 1", "objective 2"],
    "content": "Detailed lesson content with examples",
    "exercises": ["exercise 1", "exercise 2"],
    "questions": ["question 1", "question 2"]
  }
}`;

    const result = await geminiResponse(lessonPrompt, "roadmap-lesson");

    if (!result) {
      return res.status(500).json({ message: "Failed to generate lesson content" });
    }

    const jsonMatch = result.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      return res.status(500).json({ message: "Invalid lesson response format" });
    }

    let lessonData;
    try {
      lessonData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      return res.status(500).json({ message: "Failed to parse lesson data" });
    }

    // Update progress
    teacherProgress.totalLessons += 1;
    teacherProgress.lastLessonDate = new Date();

    // Update streak
    const today = new Date().toDateString();
    const lastLessonDate = teacherProgress.lastLessonDate ? new Date(teacherProgress.lastLessonDate).toDateString() : null;

    if (lastLessonDate === today) {
      // Same day, don't increment streak
    } else if (lastLessonDate === new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()) {
      // Consecutive day, increment streak
      teacherProgress.streak += 1;
    } else {
      // Streak broken, reset to 1
      teacherProgress.streak = 1;
    }

    await user.save();

    return res.status(200).json({
      teacher,
      lesson: lessonData.lesson,
      progress: teacherProgress,
      message: "Roadmap lesson started successfully"
    });
  } catch (error) {
    console.error("startRoadmapLesson error:", error);
    return res.status(500).json({ message: "Failed to start roadmap lesson", error: error.message });
  }
};

// Complete lesson and move to next
export const completeRoadmapLesson = async (req, res) => {
  try {
    const { teacherId, moduleId, lessonIndex, score } = req.body;
    const userId = req.userId;

    if (!teacherId || !moduleId) {
      return res.status(400).json({ message: "Teacher ID and module ID are required" });
    }

    const teacher = teacherTypes.find(t => t.id === teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const teacherProgress = user.teacherProgress?.find(p => p.teacherId === teacherId);
    if (!teacherProgress) {
      return res.status(404).json({ message: "Teacher progress not found" });
    }

    // Update progress if score is good
    if (score >= 70) {
      teacherProgress.lessonsCompleted += 1;

      // Move to next lesson or module
      const currentModuleLessons = teacher.roadmap[moduleId];
      const nextLessonIndex = (lessonIndex || 0) + 1;

      if (nextLessonIndex < currentModuleLessons.length) {
        // Next lesson in same module
        teacherProgress.currentLessonIndex = nextLessonIndex;
      } else {
        // Next module
        const moduleNumbers = Object.keys(teacher.roadmap).sort();
        const currentModuleIndex = moduleNumbers.indexOf(moduleId);
        const nextModuleIndex = currentModuleIndex + 1;

        if (nextModuleIndex < moduleNumbers.length) {
          const nextModule = moduleNumbers[nextModuleIndex];
          teacherProgress.currentModule = nextModule;
          teacherProgress.currentLessonIndex = 0;
        } else {
          // Completed all modules
          teacherProgress.currentLevel = "Advanced";
        }
      }

      // Update level based on progress
      if (teacherProgress.lessonsCompleted >= 20) {
        teacherProgress.currentLevel = "Advanced";
      } else if (teacherProgress.lessonsCompleted >= 10) {
        teacherProgress.currentLevel = "Intermediate";
      }
    }

    await user.save();

    return res.status(200).json({
      teacher,
      progress: teacherProgress,
      nextLesson: {
        module: teacherProgress.currentModule,
        lessonIndex: teacherProgress.currentLessonIndex,
        lesson: teacher.roadmap[teacherProgress.currentModule]?.[teacherProgress.currentLessonIndex]
      },
      message: "Lesson completed successfully"
    });
  } catch (error) {
    console.error("completeRoadmapLesson error:", error);
    return res.status(500).json({ message: "Failed to complete lesson", error: error.message });
  }
};

// Ask teacher a question (direct interaction)
export const askTeacher = async (req, res) => {
  try {
    const { teacherId, question } = req.body;
    const userId = req.userId;

    if (!teacherId || !question) {
      return res.status(400).json({ message: "Teacher ID and question are required" });
    }

    const teacher = teacherTypes.find(t => t.id === teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Save question to history
    user.history.push(`Teacher (${teacher.title}): ${question}`);
    await user.save();

    // Generate response using teacher's prompt
    const responsePrompt = `${teacher.prompt}

Student question: ${question}

Provide a helpful, educational response. If it's a coding question, include code examples. If it's grammar/pronunciation, provide examples and practice tips.`;

    const result = await geminiResponse(responsePrompt, "teacher-response");

    if (!result) {
      return res.status(500).json({ message: "Failed to get teacher response" });
    }

    return res.status(200).json({
      teacher,
      question,
      response: result,
      message: "Teacher response generated successfully"
    });
  } catch (error) {
    console.error("askTeacher error:", error);
    return res.status(500).json({ message: "Failed to get teacher response", error: error.message });
  }
};

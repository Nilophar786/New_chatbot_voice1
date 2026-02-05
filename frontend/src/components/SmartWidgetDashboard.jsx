import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { userDataContext } from '../context/UserContext.jsx';
import { useLocation } from 'react-router-dom';
import CandySagaGame from './CandySagaGame';
import AchievementBadges from './AchievementBadges';
import axios from 'axios';
import { FaPlus, FaTrashAlt, FaEdit } from 'react-icons/fa';

const SmartWidgetDashboard = ({ onCommand, mode, showButton = true, showDashboardButton = true }) => {
  const { userData, setUserData, serverUrl } = useContext(userDataContext);
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('quick');
  const [suggestions, setSuggestions] = useState([]);
  const [isDashboardVisible, setIsDashboardVisible] = useState(false);

  // Reset dashboard state when component unmounts or when navigating away
  useEffect(() => {
    return () => {
      setIsDashboardVisible(false);
    };
  }, []);

  useEffect(() => {
    setIsDashboardVisible(false);
  }, [mode]);

  // Enhanced Game state for multiple games
  const [gameState, setGameState] = useState({
    numberGuess: {
      targetNumber: null,
      guess: '',
      attempts: 0,
      maxAttempts: 7,
      gameStatus: 'idle',
      message: ''
    },
    rockPaperScissors: {
      playerChoice: null,
      computerChoice: null,
      result: null,
      score: { wins: 0, losses: 0, ties: 0 },
      gameStatus: 'idle'
    },
    memoryGame: {
      cards: [],
      flippedCards: [],
      matchedPairs: [],
      moves: 0,
      gameStatus: 'idle',
      difficulty: 'easy'
    },
    ticTacToe: {
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      gameStatus: 'idle'
    },
    wordGuess: {
      word: '',
      guessedLetters: [],
      wrongGuesses: 0,
      maxWrongGuesses: 6,
      gameStatus: 'idle',
      hint: ''
    },
    mathQuiz: {
      question: '',
      answer: null,
      userAnswer: '',
      score: 0,
      totalQuestions: 0,
      gameStatus: 'idle'
    },
    activeGame: 'numberGuess'
  });

  const [selectedGame, setSelectedGame] = useState('numberGuess');

  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [editingText, setEditingText] = useState('');

  const availableGames = [
    { id: 'numberGuess', name: 'Number Guessing', icon: '🎯', color: 'from-green-500 to-emerald-500' },
    { id: 'rockPaperScissors', name: 'Rock Paper Scissors', icon: '✂️', color: 'from-red-500 to-pink-500' },
    { id: 'memoryGame', name: 'Memory Game', icon: '🧠', color: 'from-purple-500 to-indigo-500' },
    { id: 'ticTacToe', name: 'Tic Tac Toe', icon: '⭕', color: 'from-blue-500 to-cyan-500' },
    { id: 'wordGuess', name: 'Word Guessing', icon: '📝', color: 'from-yellow-500 to-orange-500' },
    { id: 'mathQuiz', name: 'Math Quiz', icon: '🧮', color: 'from-green-500 to-teal-500' },
    { id: 'candySaga', name: 'Candy Saga', icon: '🍬', color: 'from-pink-500 to-purple-500' } // <-- Add this line
  ];

  const quickActions = [
    {
      id: 'weather',
      title: 'Weather',
      icon: '🌤️',
      color: 'from-blue-500 to-cyan-500',
      action: () => onCommand({ type: 'weather-show', userInput: 'weather' })
    },
    {
      id: 'calculator',
      title: 'Calculator',
      icon: '🧮',
      color: 'from-green-500 to-emerald-500',
      action: () => onCommand({ type: 'calculator-open', userInput: 'calculator' })
    },
    {
      id: 'youtube',
      title: 'YouTube',
      icon: '📺',
      color: 'from-red-500 to-pink-500',
      action: () => onCommand({ type: 'youtube-open', userInput: 'youtube' })
    },
    {
      id: 'time',
      title: 'Time',
      icon: '🕐',
      color: 'from-purple-500 to-indigo-500',
      action: () => onCommand({ type: 'time-check', userInput: 'what time is it' })
    },
    {
      id: 'joke',
      title: 'Joke',
      icon: '😄',
      color: 'from-yellow-500 to-orange-500',
      action: () => onCommand({ type: 'tell-joke', userInput: 'tell me a joke' })
    },
    {
      id: 'search',
      title: 'Search',
      icon: '🔍',
      color: 'from-gray-500 to-gray-600',
      action: () => onCommand({ type: 'google-search', userInput: 'search' })
    }
  ];

  const contextualSuggestions = [
    {
      id: 'morning',
      title: 'Good Morning Routine',
      icon: '☀️',
      items: ['Check weather', 'News briefing', 'Motivational quote'],
      time: 'morning'
    },
    {
      id: 'afternoon',
      title: 'Productivity Boost',
      icon: '⚡',
      items: ['Quick tasks', 'Focus music', 'Break reminder'],
      time: 'afternoon'
    },
    {
      id: 'evening',
      title: 'Relax & Unwind',
      icon: '🌙',
      items: ['Meditation', 'Entertainment', 'Daily recap'],
      time: 'evening'
    }
  ];

  useEffect(() => {
    const hour = new Date().getHours();
    let currentTimeOfDay = 'afternoon';
    if (hour < 12) currentTimeOfDay = 'morning';
    else if (hour > 18) currentTimeOfDay = 'evening';
    const relevantSuggestions = contextualSuggestions.filter(s => s.time === currentTimeOfDay);
    setSuggestions(relevantSuggestions);
  }, []);

  const categories = [
    { id: 'quick', label: 'Quick Actions', icon: '⚡' },
    { id: 'suggestions', label: 'Smart Suggestions', icon: '💡' },
    { id: 'games', label: 'Games', icon: '🎮' },
    { id: 'notes', label: 'Notes', icon: '📝' },
    { id: 'teachers', label: 'AI Teachers', icon: '👨‍🏫' }
  ];

  // --- Game Functions ---
  const startNumberGame = () => {
    const target = Math.floor(Math.random() * 100) + 1;
    setGameState(prev => ({
      ...prev,
      numberGuess: {
        targetNumber: target,
        guess: '',
        attempts: 0,
        maxAttempts: 7,
        gameStatus: 'playing',
        message: `I'm thinking of a number between 1 and 100. You have ${7} attempts!`
      },
      activeGame: 'numberGuess'
    }));
  };

  const makeNumberGuess = () => {
    const guessNum = parseInt(gameState.numberGuess.guess);
    if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) {
      setGameState(prev => ({
        ...prev,
        numberGuess: {
          ...prev.numberGuess,
          message: 'Please enter a valid number between 1 and 100!'
        }
      }));
      return;
    }
    const newAttempts = gameState.numberGuess.attempts + 1;
    let message = '';
    let status = 'playing';
    if (guessNum === gameState.numberGuess.targetNumber) {
      message = `🎉 Congratulations! You guessed ${gameState.numberGuess.targetNumber} in ${newAttempts} attempts!`;
      status = 'won';
    } else if (newAttempts >= gameState.numberGuess.maxAttempts) {
      message = `😔 Game Over! The number was ${gameState.numberGuess.targetNumber}. Better luck next time!`;
      status = 'lost';
    } else if (guessNum < gameState.numberGuess.targetNumber) {
      message = `📈 Too low! Try a higher number. Attempts: ${newAttempts}/${gameState.numberGuess.maxAttempts}`;
    } else {
      message = `📉 Too high! Try a lower number. Attempts: ${newAttempts}/${gameState.numberGuess.maxAttempts}`;
    }
    setGameState(prev => ({
      ...prev,
      numberGuess: {
        ...prev.numberGuess,
        guess: '',
        attempts: newAttempts,
        gameStatus: status,
        message: message
      }
    }));
  };

  const resetNumberGame = () => {
    setGameState(prev => ({
      ...prev,
      numberGuess: {
        targetNumber: null,
        guess: '',
        attempts: 0,
        maxAttempts: 7,
        gameStatus: 'idle',
        message: ''
      }
    }));
  };

  // Rock Paper Scissors Functions
  const playRockPaperScissors = (playerChoice) => {
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    let result = '';
    if (playerChoice === computerChoice) {
      result = 'tie';
    } else if (
      (playerChoice === 'rock' && computerChoice === 'scissors') ||
      (playerChoice === 'paper' && computerChoice === 'rock') ||
      (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
      result = 'win';
    } else {
      result = 'lose';
    }
    setGameState(prev => ({
      ...prev,
      rockPaperScissors: {
        playerChoice,
        computerChoice,
        result,
        score: {
          ...prev.rockPaperScissors.score,
          [result === 'win' ? 'wins' : result === 'lose' ? 'losses' : 'ties']:
            prev.rockPaperScissors.score[result === 'win' ? 'wins' : result === 'lose' ? 'losses' : 'ties'] + 1
        },
        gameStatus: 'finished'
      },
      activeGame: 'rockPaperScissors'
    }));
  };

  const resetRockPaperScissors = () => {
    setGameState(prev => ({
      ...prev,
      rockPaperScissors: {
        playerChoice: null,
        computerChoice: null,
        result: null,
        score: { wins: 0, losses: 0, ties: 0 },
        gameStatus: 'idle'
      }
    }));
  };

  // Memory Game Functions
  const startMemoryGame = (difficulty = 'easy') => {
    const cardCount = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 12 : 16;
    const pairs = cardCount / 2;
    const symbols = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎪', '🎸', '🎹', '🎺', '🎻', '🎧', '🎤', '🎧', '🎵', '🎶'];
    const gameCards = [];
    for (let i = 0; i < pairs; i++) {
      const symbol = symbols[i % symbols.length];
      gameCards.push({ id: i * 2, symbol, isFlipped: false, isMatched: false });
      gameCards.push({ id: i * 2 + 1, symbol, isFlipped: false, isMatched: false });
    }
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }
    setGameState(prev => ({
      ...prev,
      memoryGame: {
        cards: gameCards,
        flippedCards: [],
        matchedPairs: [],
        moves: 0,
        gameStatus: 'playing',
        difficulty
      },
      activeGame: 'memoryGame'
    }));
  };

  const flipMemoryCard = (cardId) => {
    if (gameState.memoryGame.flippedCards.length === 2) return;
    const newFlippedCards = [...gameState.memoryGame.flippedCards, cardId];
    const newMoves = gameState.memoryGame.moves + 1;
    setGameState(prev => ({
      ...prev,
      memoryGame: {
        ...prev.memoryGame,
        flippedCards: newFlippedCards,
        moves: newMoves
      }
    }));
    if (newFlippedCards.length === 2) {
      setTimeout(() => {
        setGameState(prev => {
          const [firstCard, secondCard] = newFlippedCards;
          const firstCardSymbol = prev.memoryGame.cards.find(card => card.id === firstCard)?.symbol;
          const secondCardSymbol = prev.memoryGame.cards.find(card => card.id === secondCard)?.symbol;
          if (firstCardSymbol === secondCardSymbol) {
            return {
              ...prev,
              memoryGame: {
                ...prev.memoryGame,
                matchedPairs: [...prev.memoryGame.matchedPairs, firstCard, secondCard],
                flippedCards: []
              }
            };
          } else {
            return {
              ...prev,
              memoryGame: {
                ...prev.memoryGame,
                flippedCards: []
              }
            };
          }
        });
      }, 1000);
    }
  };

  // Tic Tac Toe Functions
  const makeTicTacToeMove = (index) => {
    if (gameState.ticTacToe.board[index] || gameState.ticTacToe.winner) return;
    const newBoard = [...gameState.ticTacToe.board];
    newBoard[index] = gameState.ticTacToe.currentPlayer;
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    let winner = null;
    for (let pattern of winPatterns) {
      if (pattern.every(idx => newBoard[idx] === gameState.ticTacToe.currentPlayer)) {
        winner = gameState.ticTacToe.currentPlayer;
        break;
      }
    }
    setGameState(prev => ({
      ...prev,
      ticTacToe: {
        board: newBoard,
        currentPlayer: prev.ticTacToe.currentPlayer === 'X' ? 'O' : 'X',
        winner,
        gameStatus: winner ? 'finished' : 'playing'
      },
      activeGame: 'ticTacToe'
    }));
  };

  const resetTicTacToe = () => {
    setGameState(prev => ({
      ...prev,
      ticTacToe: {
        board: Array(9).fill(null),
        currentPlayer: 'X',
        winner: null,
        gameStatus: 'idle'
      }
    }));
  };

  // Word Guessing Functions
  const startWordGame = () => {
    const words = ['JAVASCRIPT', 'REACT', 'PROGRAMMING', 'COMPUTER', 'ALGORITHM', 'DATABASE', 'FRAMEWORK', 'DEVELOPER'];
    const word = words[Math.floor(Math.random() * words.length)];
    const hint = word.length <= 6 ? 'Short word' : word.length <= 10 ? 'Medium word' : 'Long word';
    setGameState(prev => ({
      ...prev,
      wordGuess: {
        word,
        guessedLetters: [],
        wrongGuesses: 0,
        maxWrongGuesses: 6,
        gameStatus: 'playing',
        hint
      },
      activeGame: 'wordGuess'
    }));
  };

  const guessWordLetter = (letter) => {
    if (gameState.wordGuess.guessedLetters.includes(letter)) return;
    const newGuessedLetters = [...gameState.wordGuess.guessedLetters, letter];
    const isCorrect = gameState.wordGuess.word.includes(letter);
    const newWrongGuesses = isCorrect ? gameState.wordGuess.wrongGuesses : gameState.wordGuess.wrongGuesses + 1;
    const isWon = gameState.wordGuess.word.split('').every(char => newGuessedLetters.includes(char));
    const isLost = newWrongGuesses >= gameState.wordGuess.maxWrongGuesses;
    setGameState(prev => ({
      ...prev,
      wordGuess: {
        ...prev.wordGuess,
        guessedLetters: newGuessedLetters,
        wrongGuesses: newWrongGuesses,
        gameStatus: isWon ? 'won' : isLost ? 'lost' : 'playing'
      },
      activeGame: 'wordGuess'
    }));
  };

  // Math Quiz Functions
  const startMathQuiz = () => {
    const generateQuestion = () => {
      const operations = ['+', '-', '*'];
      const operation = operations[Math.floor(Math.random() * operations.length)];
      let num1, num2, answer;
      switch (operation) {
        case '+':
          num1 = Math.floor(Math.random() * 50) + 1;
          num2 = Math.floor(Math.random() * 50) + 1;
          answer = num1 + num2;
          break;
        case '-':
          num1 = Math.floor(Math.random() * 50) + 20;
          num2 = Math.floor(Math.random() * num1) + 1;
          answer = num1 - num2;
          break;
        case '*':
          num1 = Math.floor(Math.random() * 12) + 1;
          num2 = Math.floor(Math.random() * 12) + 1;
          answer = num1 * num2;
          break;
        default:
          num1 = 0;
          num2 = 0;
          answer = 0;
      }
      return { question: `${num1} ${operation} ${num2}`, answer };
    };
    const { question, answer } = generateQuestion();
    setGameState(prev => ({
      ...prev,
      mathQuiz: {
        question,
        answer,
        userAnswer: '',
        score: 0,
        totalQuestions: 0,
        gameStatus: 'playing'
      },
      activeGame: 'mathQuiz'
    }));
  };

  const submitMathAnswer = () => {
    const userAnswer = parseInt(gameState.mathQuiz.userAnswer);
    const isCorrect = userAnswer === gameState.mathQuiz.answer;
    const newScore = isCorrect ? gameState.mathQuiz.score + 1 : gameState.mathQuiz.score;
    const newTotalQuestions = gameState.mathQuiz.totalQuestions + 1;
    if (newTotalQuestions >= 10) {
      setGameState(prev => ({
        ...prev,
        mathQuiz: {
          ...prev.mathQuiz,
          score: newScore,
          totalQuestions: newTotalQuestions,
          gameStatus: 'finished'
        }
      }));
    } else {
      const operations = ['+', '-', '*'];
      const operation = operations[Math.floor(Math.random() * operations.length)];
      let num1, num2, answer;
      switch (operation) {
        case '+':
          num1 = Math.floor(Math.random() * 50) + 1;
          num2 = Math.floor(Math.random() * 50) + 1;
          answer = num1 + num2;
          break;
        case '-':
          num1 = Math.floor(Math.random() * 50) + 20;
          num2 = Math.floor(Math.random() * num1) + 1;
          answer = num1 - num2;
          break;
        case '*':
          num1 = Math.floor(Math.random() * 12) + 1;
          num2 = Math.floor(Math.random() * 12) + 1;
          answer = num1 * num2;
          break;
        default:
          num1 = 0;
          num2 = 0;
          answer = 0;
      }
      setGameState(prev => ({
        ...prev,
        mathQuiz: {
          question: `${num1} ${operation} ${num2}`,
          answer,
          userAnswer: '',
          score: newScore,
          totalQuestions: newTotalQuestions,
          gameStatus: 'playing'
        }
      }));
    }
  };

  // Generic game handlers
  const handleNumberGuessChange = (e) => {
    setGameState(prev => ({
      ...prev,
      numberGuess: {
        ...prev.numberGuess,
        guess: e.target.value
      }
    }));
  };

  const handleMathAnswerChange = (e) => {
    setGameState(prev => ({
      ...prev,
      mathQuiz: {
        ...prev.mathQuiz,
        userAnswer: e.target.value
      }
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (selectedGame === 'numberGuess' && gameState.numberGuess.gameStatus === 'playing') {
        makeNumberGuess();
      } else if (selectedGame === 'mathQuiz' && gameState.mathQuiz.gameStatus === 'playing') {
        submitMathAnswer();
      }
    }
  };

  // Notes Functions
  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, newNote.trim()]);
      setNewNote('');
    }
  };

  const deleteNote = async (index) => {
    try {
      await axios.post(`${serverUrl}/api/user/notes/delete`, { index });
      setNotes(notes.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting note:', error);
      // Optionally show an error message to the user
    }
  };

  const startEditing = (index) => {
    setEditingNote(index);
    setEditingText(notes[index]);
  };

  const saveEdit = () => {
    if (editingText.trim()) {
      const updatedNotes = [...notes];
      updatedNotes[editingNote] = editingText.trim();
      setNotes(updatedNotes);
      setEditingNote(null);
      setEditingText('');
    }
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setEditingText('');
  };

  // Dashboard control functions
  const toggleDashboard = () => {
    setIsDashboardVisible(!isDashboardVisible);
  };

  const hideDashboard = () => {
    setIsDashboardVisible(false);
  };

  const shouldShowDashboardButton = showDashboardButton && !location.pathname.startsWith("/history");

  const suggestionItemDetails = {
    'Check weather': { icon: '🌤️', color: 'from-blue-400 to-cyan-400', desc: 'See today’s weather.' },
    'News briefing': { icon: '📰', color: 'from-yellow-400 to-orange-400', desc: 'Get latest news.' },
    'Motivational quote': { icon: '💬', color: 'from-purple-400 to-pink-400', desc: 'Read a motivational quote.' },
    'Quick tasks': { icon: '✅', color: 'from-green-400 to-emerald-400', desc: 'Finish small tasks.' },
    'Focus music': { icon: '🎵', color: 'from-indigo-400 to-blue-400', desc: 'Play focus music.' },
    'Break reminder': { icon: '⏰', color: 'from-red-400 to-pink-400', desc: 'Take a short break.' },
    'Meditation': { icon: '🧘', color: 'from-teal-400 to-green-400', desc: 'Start a meditation session.' },
    'Entertainment': { icon: '🎬', color: 'from-pink-400 to-purple-400', desc: 'Watch or play something fun.' },
    'Daily recap': { icon: '📋', color: 'from-gray-400 to-gray-600', desc: 'Review your day.' }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 relative">
      {/* Dashboard Toggle Button - Center */}
      {showButton && shouldShowDashboardButton && (
         <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <motion.button
            onClick={toggleDashboard}
            className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 rounded-xl text-white font-medium transition-all duration-300 border border-purple-400/20 hover:border-purple-400/40 cursor-pointer flex items-center gap-2 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-lg">📊</span>
            <span className="hidden sm:inline">{isDashboardVisible ? 'Hide' : 'Dashboard'}</span>
          </motion.button>
        </div>
      )}

      {/* Dashboard Popup */}
      <AnimatePresence>
        {isDashboardVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={hideDashboard}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="bg-gray-800/95 backdrop-blur-lg rounded-2xl p-8 border border-gray-600/30 max-w-4xl mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Dashboard Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Smart Widget Dashboard</h2>
                <motion.button
                  onClick={hideDashboard}
                  className="text-gray-400 hover:text-white text-2xl"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </div>

              {/* Category Tabs */}
              <div className="flex gap-4 mb-4">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`px-4 py-2 rounded ${activeCategory === cat.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>

              {/* Dashboard Content */}
              <AnimatePresence mode="wait">
                {activeCategory === 'quick' && (
                  <motion.div
                    key="quick"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    {quickActions.map(action => (
                      <button
                        key={action.id}
                        className={`p-4 rounded shadow bg-gradient-to-r ${action.color} text-xl flex items-center gap-2`}
                        onClick={action.action}
                      >
                        <span>{action.icon}</span>
                        <span>{action.title}</span>
                      </button>
                    ))}
                  </motion.div>
                )}

                {activeCategory === 'suggestions' && (
                  <motion.div
                    key="suggestions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 gap-6"
                  >
                    {suggestions.map((suggestion, index) => (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="bg-gradient-to-r from-gray-800/70 to-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-600/30 shadow-xl"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="text-3xl">{suggestion.icon}</div>
                          <h3 className="text-xl font-bold text-white">{suggestion.title}</h3>
                          <motion.button
                            onClick={() => suggestion.items.forEach(item => onCommand({ type: 'suggestion-click', userInput: item.toLowerCase() }))}
                            className="ml-auto px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow hover:scale-105 transition"
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Quick Run All
                          </motion.button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {suggestion.items.map((item, itemIndex) => {
                            const details = suggestionItemDetails[item] || {};
                            return (
                              <motion.button
                                key={itemIndex}
                                onClick={() => onCommand({ type: 'suggestion-click', userInput: item.toLowerCase() })}
                                className={`bg-gradient-to-r ${details.color || 'from-gray-500 to-gray-700'} p-3 rounded-xl text-white text-sm font-medium flex items-center gap-2 transition-all duration-300 border border-purple-400/20 hover:border-purple-400/40 cursor-pointer relative group`}
                                whileHover={{ scale: 1.07 }}
                                whileTap={{ scale: 0.97 }}
                              >
                                <span className="text-lg">{details.icon || '💡'}</span>
                                <span>{item}</span>
                                {/* Tooltip */}
                                <span className="absolute left-1/2 bottom-full mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition pointer-events-none z-10"
                                  style={{ transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
                                  {details.desc || 'Run this suggestion'}
                                </span>
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {activeCategory === 'teachers' && (
                  <motion.div
                    key="teachers"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Teacher Cards */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                      className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-600/30"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-3xl">👨‍🏫</div>
                        <h3 className="text-xl font-bold text-white">AI Teachers</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.div
                          className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 p-6 rounded-xl border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300 cursor-pointer group"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onCommand({ type: 'teacher-start', userInput: 'english-teacher' })}
                        >
                          <div className="flex items-center gap-4 mb-3">
                            <div className="text-4xl">📚</div>
                            <div>
                              <h4 className="text-lg font-bold text-white">English Teacher</h4>
                              <p className="text-gray-300 text-sm">Learn grammar, speaking & writing</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">Education</span>
                            <motion.button
                              className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm font-medium group-hover:bg-blue-500/30 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Start Lesson
                            </motion.button>
                          </div>
                        </motion.div>

                        <motion.div
                          className="bg-gradient-to-br from-green-500/20 to-teal-500/20 p-6 rounded-xl border border-green-400/20 hover:border-green-400/40 transition-all duration-300 cursor-pointer group"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onCommand({ type: 'teacher-start', userInput: 'fullstack-teacher' })}
                        >
                          <div className="flex items-center gap-4 mb-3">
                            <div className="text-4xl">💻</div>
                            <div>
                              <h4 className="text-lg font-bold text-white">Full Stack Teacher</h4>
                              <p className="text-gray-300 text-sm">HTML, CSS, JS, React, Node, Database</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">Programming</span>
                            <motion.button
                              className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg text-sm font-medium group-hover:bg-green-500/30 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Start Lesson
                            </motion.button>
                          </div>
                        </motion.div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-600/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-lg font-bold text-white mb-1">Quick Actions</h4>
                            <p className="text-gray-400 text-sm">Direct teacher interactions</p>
                          </div>
                          <div className="flex gap-2">
                            <motion.button
                              onClick={() => onCommand({ type: 'teacher-progress', userInput: 'teacher progress' })}
                              className="px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 rounded-lg text-sm font-medium transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              📊 Progress
                            </motion.button>
                            <motion.button
                              onClick={() => onCommand({ type: 'teacher-ask', userInput: 'ask teacher' })}
                              className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg text-sm font-medium transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              💬 Ask Question
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {activeCategory === 'games' && (
                  <motion.div
                    key="games"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Game Selection */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                      className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-600/30"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-3xl">🎮</div>
                        <h3 className="text-xl font-bold text-white">Select a Game</h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {availableGames.map((game, index) => (
                          <motion.button
                            key={game.id}
                            onClick={() => setSelectedGame(game.id)}
                            className={`p-4 rounded-xl text-white font-medium transition-all duration-300 border cursor-pointer ${
                              selectedGame === game.id
                                ? `bg-gradient-to-br ${game.color} border-white/30 shadow-lg`
                                : 'bg-gray-700/30 border-gray-600/30 hover:bg-gray-700/50'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="text-center">
                              <div className="text-2xl mb-1">{game.icon}</div>
                              <div className="text-xs">{game.name}</div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>

                    {/* Game Content */}
                    <AnimatePresence mode="wait">
                      {selectedGame === 'numberGuess' && (
                        <motion.div
                          key="numberGuess"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-600/30"
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <div className="text-3xl">🎯</div>
                            <h3 className="text-xl font-bold text-white">Number Guessing Game</h3>
                          </div>
                          <div className="space-y-4">
                            {gameState.numberGuess.gameStatus === 'idle' && (
                              <motion.button
                                onClick={startNumberGame}
                                className="w-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 p-4 rounded-xl text-white font-medium transition-all duration-300 border border-green-400/20 hover:border-green-400/40 cursor-pointer"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                🎮 Start New Game
                              </motion.button>
                            )}
                            {gameState.numberGuess.gameStatus === 'playing' && (
                              <div className="space-y-4">
                                <div className="flex gap-2">
                                  <input
                                    type="number"
                                    value={gameState.numberGuess.guess}
                                    onChange={handleNumberGuessChange}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Enter your guess (1-100)"
                                    className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50"
                                    min="1"
                                    max="100"
                                  />
                                  <motion.button
                                    onClick={makeNumberGuess}
                                    className="px-6 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 rounded-xl text-white font-medium transition-all duration-300 border border-purple-400/20 hover:border-purple-400/40 cursor-pointer"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    Guess
                                  </motion.button>
                                </div>
                                <motion.button
                                  onClick={resetNumberGame}
                                  className="w-full bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 p-3 rounded-xl text-white font-medium transition-all duration-300 border border-red-400/20 hover:border-red-400/40 cursor-pointer"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  🔄 Reset Game
                                </motion.button>
                              </div>
                            )}
                            {gameState.numberGuess.gameStatus !== 'idle' && (
                              <motion.button
                                onClick={resetNumberGame}
                                className="w-full bg-gradient-to-r from-gray-500/20 to-gray-600/20 hover:from-gray-500/30 hover:to-gray-600/30 p-3 rounded-xl text-white font-medium transition-all duration-300 border border-gray-400/20 hover:border-gray-400/40 cursor-pointer"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                🔄 New Game
                              </motion.button>
                            )}
                            {gameState.numberGuess.message && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-gray-700/30 rounded-xl border border-gray-600/30"
                              >
                                <p className="text-white text-center">{gameState.numberGuess.message}</p>
                              </motion.div>
                            )}
                            {gameState.numberGuess.gameStatus === 'playing' && (
                              <div className="text-center">
                                <p className="text-gray-300">
                                  Attempts: {gameState.numberGuess.attempts} / {gameState.numberGuess.maxAttempts}
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {selectedGame === 'rockPaperScissors' && (
                        <motion.div
                          key="rockPaperScissors"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-600/30"
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <div className="text-3xl">✂️</div>
                            <h3 className="text-xl font-bold text-white">Rock Paper Scissors</h3>
                          </div>
                          <div className="space-y-4">
                            {gameState.rockPaperScissors.gameStatus === 'idle' && (
                              <div className="grid grid-cols-3 gap-3">
                                <motion.button
                                  onClick={() => playRockPaperScissors('rock')}
                                  className="p-4 bg-gradient-to-r from-gray-500/20 to-gray-600/20 hover:from-gray-500/30 hover:to-gray-600/30 rounded-xl text-white font-medium transition-all duration-300 border border-gray-400/20 hover:border-gray-400/40 cursor-pointer"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  🪨 Rock
                                </motion.button>
                                <motion.button
                                  onClick={() => playRockPaperScissors('paper')}
                                  className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 rounded-xl text-white font-medium transition-all duration-300 border border-blue-400/20 hover:border-blue-400/40 cursor-pointer"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  📄 Paper
                                </motion.button>
                                <motion.button
                                  onClick={() => playRockPaperScissors('scissors')}
                                  className="p-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 rounded-xl text-white font-medium transition-all duration-300 border border-red-400/20 hover:border-red-400/40 cursor-pointer"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  ✂️ Scissors
                                </motion.button>
                              </div>
                            )}
                            {gameState.rockPaperScissors.gameStatus === 'finished' && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-center">
                                  <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                                    <div className="text-2xl mb-2">👤</div>
                                    <div className="text-white font-medium">You</div>
                                    <div className="text-3xl mt-2">{gameState.rockPaperScissors.playerChoice === 'rock' ? '🪨' : gameState.rockPaperScissors.playerChoice === 'paper' ? '📄' : '✂️'}</div>
                                  </div>
                                  <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                                    <div className="text-2xl mb-2">🤖</div>
                                    <div className="text-white font-medium">Computer</div>
                                    <div className="text-3xl mt-2">{gameState.rockPaperScissors.computerChoice === 'rock' ? '🪨' : gameState.rockPaperScissors.computerChoice === 'paper' ? '📄' : '✂️'}</div>
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className={`text-2xl font-bold p-4 rounded-xl ${
                                    gameState.rockPaperScissors.result === 'win' ? 'bg-green-500/20 text-green-400' :
                                    gameState.rockPaperScissors.result === 'lose' ? 'bg-red-500/20 text-red-400' :
                                    'bg-yellow-500/20 text-yellow-400'
                                  }`}>
                                    {gameState.rockPaperScissors.result === 'win' ? '🎉 You Win!' :
                                     gameState.rockPaperScissors.result === 'lose' ? '😔 You Lose!' :
                                     '🤝 It\'s a Tie!'}
                                  </div>
                                </div>
                                <motion.button
                                  onClick={resetRockPaperScissors}
                                  className="w-full bg-gradient-to-r from-gray-500/20 to-gray-600/20 hover:from-gray-500/30 hover:to-gray-600/30 p-3 rounded-xl text-white font-medium transition-all duration-300 border border-gray-400/20 hover:border-gray-400/40 cursor-pointer"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  🔄 Play Again
                                </motion.button>
                              </div>
                            )}
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div className="bg-green-500/10 rounded-xl p-3 border border-green-400/20">
                                <div className="text-xl font-bold text-green-400">{gameState.rockPaperScissors.score.wins}</div>
                                <div className="text-xs text-gray-300">Wins</div>
                              </div>
                              <div className="bg-red-500/10 rounded-xl p-3 border border-red-400/20">
                                <div className="text-xl font-bold text-red-400">{gameState.rockPaperScissors.score.losses}</div>
                                <div className="text-xs text-gray-300">Losses</div>
                              </div>
                              <div className="bg-yellow-500/10 rounded-xl p-3 border border-yellow-400/20">
                                <div className="text-xl font-bold text-yellow-400">{gameState.rockPaperScissors.score.ties}</div>
                                <div className="text-xs text-gray-300">Ties</div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {selectedGame === 'memoryGame' && (
                        <motion.div
                          key="memoryGame"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-600/30"
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <div className="text-3xl">🧠</div>
                            <h3 className="text-xl font-bold text-white">Memory Game</h3>
                          </div>
                          <div className="space-y-4">
                            {gameState.memoryGame.gameStatus === 'idle' && (
                              <div className="space-y-3">
                                <div className="text-center">
                                  <p className="text-gray-300 mb-4">Choose difficulty:</p>
                                  <div className="grid grid-cols-3 gap-2">
                                    <motion.button
                                      onClick={() => startMemoryGame('easy')}
                                      className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 rounded-xl text-white font-medium transition-all duration-300 border border-green-400/20 hover:border-green-400/40 cursor-pointer"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      🟢 Easy (8 cards)
                                    </motion.button>
                                    <motion.button
                                      onClick={() => startMemoryGame('medium')}
                                      className="p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 rounded-xl text-white font-medium transition-all duration-300 border border-yellow-400/20 hover:border-yellow-400/40 cursor-pointer"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      🟡 Medium (12 cards)
                                    </motion.button>
                                    <motion.button
                                      onClick={() => startMemoryGame('hard')}
                                      className="p-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 rounded-xl text-white font-medium transition-all duration-300 border border-red-400/20 hover:border-red-400/40 cursor-pointer"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      🔴 Hard (16 cards)
                                    </motion.button>
                                  </div>
                                </div>
                              </div>
                            )}
                            {gameState.memoryGame.gameStatus === 'playing' && (
                              <div className="space-y-4">
                                <div className="text-center">
                                  <p className="text-gray-300">Moves: {gameState.memoryGame.moves}</p>
                                  <p className="text-gray-300">Pairs found: {gameState.memoryGame.matchedPairs.length / 2}</p>
                                </div>
                                <div className={`grid gap-2 ${
                                  gameState.memoryGame.difficulty === 'easy' ? 'grid-cols-4' :
                                  gameState.memoryGame.difficulty === 'medium' ? 'grid-cols-4' : 'grid-cols-4'
                                }`}>
                                  {gameState.memoryGame.cards.map((card) => (
                                    <motion.button
                                      key={card.id}
                                      onClick={() => flipMemoryCard(card.id)}
                                      disabled={card.isMatched || gameState.memoryGame.flippedCards.includes(card.id)}
                                      className={`aspect-square p-2 rounded-xl text-2xl transition-all duration-300 border ${
                                        card.isMatched
                                          ? 'bg-green-500/20 border-green-400/40 cursor-default'
                                          : gameState.memoryGame.flippedCards.includes(card.id)
                                          ? 'bg-purple-500/30 border-purple-400/40'
                                          : 'bg-gray-700/30 border-gray-600/30 hover:bg-gray-700/50 cursor-pointer'
                                      }`}
                                      whileHover={card.isMatched ? {} : { scale: 1.05 }}
                                      whileTap={card.isMatched ? {} : { scale: 0.95 }}
                                    >
                                      {card.isMatched || gameState.memoryGame.flippedCards.includes(card.id) ? card.symbol : '❓'}
                                    </motion.button>
                                  ))}
                                </div>
                                <motion.button
                                  onClick={() => startMemoryGame(gameState.memoryGame.difficulty)}
                                  className="w-full bg-gradient-to-r from-gray-500/20 to-gray-600/20 hover:from-gray-500/30 hover:to-gray-600/30 p-3 rounded-xl text-white font-medium transition-all duration-300 border border-gray-400/20 hover:border-gray-400/40 cursor-pointer"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  🔄 New Game
                                </motion.button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {selectedGame === 'ticTacToe' && (
                        <motion.div
                          key="ticTacToe"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-600/30"
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <div className="text-3xl">⭕</div>
                            <h3 className="text-xl font-bold text-white">Tic Tac Toe</h3>
                          </div>
                          <div className="space-y-4">
                            {gameState.ticTacToe.gameStatus === 'idle' && (
                              <motion.button
                                onClick={() => makeTicTacToeMove(0)}
                                className="w-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 p-4 rounded-xl text-white font-medium transition-all duration-300 border border-blue-400/20 hover:border-blue-400/40 cursor-pointer"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                🎮 Start New Game
                              </motion.button>
                            )}
                            {gameState.ticTacToe.gameStatus !== 'idle' && (
                              <div className="space-y-4">
                                <div className="text-center">
                                  <p className="text-gray-300">
                                    Current Player: <span className="text-2xl">{gameState.ticTacToe.currentPlayer}</span>
                                  </p>
                                  {gameState.ticTacToe.winner && (
                                    <p className="text-2xl font-bold text-green-400 mt-2">
                                      🎉 Player {gameState.ticTacToe.winner} Wins!
                                    </p>
                                  )}
                                </div>
                                <div className="grid grid-cols-3 gap-2 aspect-square max-w-xs mx-auto">
                                  {gameState.ticTacToe.board.map((cell, index) => (
                                    <motion.button
                                      key={index}
                                      onClick={() => makeTicTacToeMove(index)}
                                      disabled={cell !== null || gameState.ticTacToe.winner !== null}
                                      className={`aspect-square text-4xl font-bold rounded-xl transition-all duration-300 border ${
                                        cell
                                          ? 'bg-gray-600/50 border-gray-500/50 cursor-default'
                                          : 'bg-gray-700/30 border-gray-600/30 hover:bg-gray-700/50 cursor-pointer'
                                      }`}
                                      whileHover={cell ? {} : { scale: 1.05 }}
                                      whileTap={cell ? {} : { scale: 0.95 }}
                                    >
                                      {cell}
                                    </motion.button>
                                  ))}
                                </div>
                                <motion.button
                                  onClick={resetTicTacToe}
                                  className="w-full bg-gradient-to-r from-gray-500/20 to-gray-600/20 hover:from-gray-500/30 hover:to-gray-600/30 p-3 rounded-xl text-white font-medium transition-all duration-300 border border-gray-400/20 hover:border-gray-400/40 cursor-pointer"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  🔄 New Game
                                </motion.button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {selectedGame === 'wordGuess' && (
                        <motion.div
                          key="wordGuess"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-600/30"
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <div className="text-3xl">📝</div>
                            <h3 className="text-xl font-bold text-white">Word Guessing Game</h3>
                          </div>
                          <div className="space-y-4">
                            {gameState.wordGuess.gameStatus === 'idle' && (
                              <motion.button
                                onClick={startWordGame}
                                className="w-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 p-4 rounded-xl text-white font-medium transition-all duration-300 border border-yellow-400/20 hover:border-yellow-400/40 cursor-pointer"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                🎮 Start New Game
                              </motion.button>
                            )}
                            {gameState.wordGuess.gameStatus !== 'idle' && (
                              <div className="space-y-4">
                                <div className="text-center">
                                  <p className="text-gray-300 mb-2">Hint: {gameState.wordGuess.hint}</p>
                                  <p className="text-gray-300">Wrong guesses: {gameState.wordGuess.wrongGuesses} / {gameState.wordGuess.maxWrongGuesses}</p>
                                </div>
                                <div className="text-center">
                                  <div className="text-3xl font-bold text-white mb-4">
                                    {gameState.wordGuess.word.split('').map((letter) =>
                                      gameState.wordGuess.guessedLetters.includes(letter) ? letter + ' ' : '_ '
                                    )}
                                  </div>
                                </div>
                                <div className="grid grid-cols-6 gap-2 max-w-sm mx-auto">
                                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map((letter) => (
                                    <motion.button
                                      key={letter}
                                      onClick={() => guessWordLetter(letter)}
                                      disabled={gameState.wordGuess.guessedLetters.includes(letter) || gameState.wordGuess.gameStatus === 'won' || gameState.wordGuess.gameStatus === 'lost'}
                                      className={`p-2 text-sm font-bold rounded transition-all duration-300 border ${
                                        gameState.wordGuess.guessedLetters.includes(letter)
                                          ? 'bg-gray-600/50 border-gray-500/50 cursor-default'
                                          : 'bg-gray-700/30 border-gray-600/30 hover:bg-gray-700/50 cursor-pointer'
                                      }`}
                                      whileHover={!gameState.wordGuess.guessedLetters.includes(letter) ? { scale: 1.05 } : {}}
                                      whileTap={!gameState.wordGuess.guessedLetters.includes(letter) ? { scale: 0.95 } : {}}
                                    >
                                      {letter}
                                    </motion.button>
                                  ))}
                                </div>
                                {gameState.wordGuess.gameStatus === 'won' && (
                                  <div className="text-center">
                                    <p className="text-2xl font-bold text-green-400">🎉 Congratulations! You won!</p>
                                  </div>
                                )}
                                {gameState.wordGuess.gameStatus === 'lost' && (
                                  <div className="text-center">
                                    <p className="text-2xl font-bold text-red-400">😔 Game Over! The word was: {gameState.wordGuess.word}</p>
                                  </div>
                                )}
                                <motion.button
                                  onClick={startWordGame}
                                  className="w-full bg-gradient-to-r from-gray-500/20 to-gray-600/20 hover:from-gray-500/30 hover:to-gray-600/30 p-3 rounded-xl text-white font-medium transition-all duration-300 border border-gray-400/20 hover:border-gray-400/40 cursor-pointer"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  🔄 New Game
                                </motion.button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {selectedGame === 'mathQuiz' && (
                        <motion.div
                          key="mathQuiz"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-600/30"
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <div className="text-3xl">🧮</div>
                            <h3 className="text-xl font-bold text-white">Math Quiz</h3>
                          </div>
                          <div className="space-y-4">
                            {gameState.mathQuiz.gameStatus === 'idle' && (
                              <motion.button
                                onClick={startMathQuiz}
                                className="w-full bg-gradient-to-r from-green-500/20 to-teal-500/20 hover:from-green-500/30 hover:to-teal-500/30 p-4 rounded-xl text-white font-medium transition-all duration-300 border border-green-400/20 hover:border-green-400/40 cursor-pointer"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                🎮 Start Quiz
                              </motion.button>
                            )}
                            {gameState.mathQuiz.gameStatus === 'playing' && (
                              <div className="space-y-4">
                                <div className="text-center">
                                  <p className="text-gray-300">Score: {gameState.mathQuiz.score} / {gameState.mathQuiz.totalQuestions}</p>
                                </div>
                                <div className="text-center">
                                  <div className="text-4xl font-bold text-white mb-4">
                                    {gameState.mathQuiz.question} = ?
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <input
                                    type="number"
                                    value={gameState.mathQuiz.userAnswer}
                                    onChange={handleMathAnswerChange}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Your answer"
                                    className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50"
                                  />
                                  <motion.button
                                    onClick={submitMathAnswer}
                                    className="px-6 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 rounded-xl text-white font-medium transition-all duration-300 border border-purple-400/20 hover:border-purple-400/40 cursor-pointer"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    Submit
                                  </motion.button>
                                </div>
                                <motion.button
                                  onClick={startMathQuiz}
                                  className="w-full bg-gradient-to-r from-gray-500/20 to-gray-600/20 hover:from-gray-500/30 hover:to-gray-600/30 p-3 rounded-xl text-white font-medium transition-all duration-300 border border-gray-400/20 hover:border-gray-400/40 cursor-pointer"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  🔄 New Quiz
                                </motion.button>
                              </div>
                            )}
                            {gameState.mathQuiz.gameStatus === 'finished' && (
                              <div className="space-y-4">
                                <div className="text-center">
                                  <p className="text-2xl font-bold text-white">Quiz Complete!</p>
                                  <p className="text-xl text-gray-300">Final Score: {gameState.mathQuiz.score} / {gameState.mathQuiz.totalQuestions}</p>
                                  <p className="text-lg text-gray-400">
                                    {gameState.mathQuiz.score >= 8 ? '🎉 Excellent!' :
                                     gameState.mathQuiz.score >= 6 ? '👍 Good job!' :
                                     gameState.mathQuiz.score >= 4 ? '👌 Not bad!' : '📚 Keep practicing!'}
                                  </p>
                                </div>
                                <motion.button
                                  onClick={startMathQuiz}
                                  className="w-full bg-gradient-to-r from-gray-500/20 to-gray-600/20 hover:from-gray-500/30 hover:to-gray-600/30 p-3 rounded-xl text-white font-medium transition-all duration-300 border border-gray-400/20 hover:border-gray-400/40 cursor-pointer"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  🔄 New Quiz
                                </motion.button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {selectedGame === 'candySaga' && (
                        <CandySagaGame />
                      )}

                      {activeCategory === 'notes' && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="space-y-4"
                        >
                          <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-white mb-2">📝 Quick Notes</h3>
                            <p className="text-gray-400">Add and manage your notes</p>
                          </div>

                          {/* Add Note */}
                          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-600/30">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Write a quick note..."
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addNote()}
                                className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50 text-sm"
                              />
                              <motion.button
                                onClick={addNote}
                                disabled={!newNote.trim()}
                                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <FaPlus className="text-sm" />
                                Add
                              </motion.button>
                            </div>
                          </div>

                          {/* Notes List */}
                          <div className="space-y-3 max-h-96 overflow-y-auto">
                            {notes.length > 0 ? (
                              notes.map((note, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 20 }}
                                  className="bg-gray-800/50 rounded-xl p-4 border border-gray-600/30 hover:border-purple-400/30 transition-all duration-300"
                                >
                                  {editingNote === index ? (
                                    <div className="space-y-3">
                                      <textarea
                                        value={editingText}
                                        onChange={(e) => setEditingText(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50 resize-none text-sm"
                                        rows="3"
                                      />
                                      <div className="flex gap-2">
                                        <motion.button
                                          onClick={saveEdit}
                                          className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors text-sm"
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                        >
                                          Save
                                        </motion.button>
                                        <motion.button
                                          onClick={cancelEdit}
                                          className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors text-sm"
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                        >
                                          Cancel
                                        </motion.button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex justify-between items-start gap-3">
                                      <p className="text-white text-sm leading-relaxed flex-1 whitespace-pre-wrap break-words">
                                        {note}
                                      </p>
                                      <div className="flex gap-1">
                                        <motion.button
                                          onClick={() => startEditing(index)}
                                          className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                                          title="Edit note"
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                        >
                                          <FaEdit className="text-sm" />
                                        </motion.button>
                                        <motion.button
                                          onClick={() => deleteNote(index)}
                                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                                          title="Delete note"
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                        >
                                          <FaTrashAlt className="text-sm" />
                                        </motion.button>
                                      </div>
                                    </div>
                                  )}
                                </motion.div>
                              ))
                            ) : (
                              <div className="text-center py-8">
                                <div className="text-4xl mb-2">📝</div>
                                <p className="text-gray-400 text-sm">No notes yet</p>
                                <p className="text-gray-500 text-xs mt-1">Add your first note above!</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default SmartWidgetDashboard;

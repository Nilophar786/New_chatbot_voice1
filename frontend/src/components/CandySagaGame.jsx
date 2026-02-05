import React, { useState, useEffect, useRef } from 'react';

// Import fruit images
import banana from '../assets/banana.jpeg';
import grapes from '../assets/grapes.jpg';
import apple from '../assets/apple.jpeg';
import pineapple from '../assets/pineapple.webp';

// Import sound effects
import swapSound from '../assets/Voicy_Shuffling.mp3';
import matchSound from '../assets/Voicy_Jam.mp3';
import juicySound from '../assets/Voicy_Juicy.mp3';
import tastySound from '../assets/Voicy_Tasty.mp3';
import sodaSound from '../assets/Voicy_Soda crush.mp3';
import deliciousSound from '../assets/Voicy_So delicious.mp3';
import marvelousSound from '../assets/Voicy_Marvelous.mp3';
import frostedSound from '../assets/Voicy_Frosted bears frosting.mp3';

// Level up sound (choose any, e.g. Marvelous)
import levelUpSound from '../assets/Voicy_Marvelous.mp3';

const width = 8;
const fruitImages = [banana, grapes, apple, pineapple];

const getRandomFruit = () => fruitImages[Math.floor(Math.random() * fruitImages.length)];
const createBoard = () => Array(width * width).fill().map(getRandomFruit);

const bonusSounds = [juicySound, tastySound, sodaSound, deliciousSound, marvelousSound, frostedSound];

const levelTargets = [20, 40, 70, 100, 150, 200]; // Score needed for each level

const CandySagaGame = () => {
  const [board, setBoard] = useState(createBoard());
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [replacedIdx, setReplacedIdx] = useState(null);

  // Sound refs
  const swapRef = useRef(null);
  const matchRef = useRef(null);
  const bonusRefs = bonusSounds.map(() => useRef(null));
  const levelUpRef = useRef(null);

  useEffect(() => {
    const checkForMatches = () => {
      let newBoard = [...board];
      let points = 0;

      // Check rows
      for (let i = 0; i < width * width; i++) {
        if (i % width <= width - 3) {
          const fruit = newBoard[i];
          if (
            fruit &&
            fruit === newBoard[i + 1] &&
            fruit === newBoard[i + 2]
          ) {
            newBoard[i] = newBoard[i + 1] = newBoard[i + 2] = null;
            points += 3;
          }
        }
      }

      // Check columns
      for (let i = 0; i < width * (width - 2); i++) {
        const fruit = newBoard[i];
        if (
          fruit &&
          fruit === newBoard[i + width] &&
          fruit === newBoard[i + width * 2]
        ) {
          newBoard[i] = newBoard[i + width] = newBoard[i + width * 2] = null;
          points += 3;
        }
      }

      // Drop fruits
      for (let i = width * (width - 1) - 1; i >= 0; i--) {
        if (!newBoard[i + width] && newBoard[i]) {
          newBoard[i + width] = newBoard[i];
          newBoard[i] = null;
        }
      }

      // Fill empty spots
      for (let i = 0; i < width * width; i++) {
        if (!newBoard[i]) newBoard[i] = getRandomFruit();
      }

      if (points > 0) {
        setScore(s => {
          const newScore = s + points;
          // Play match sound
          if (matchRef.current) matchRef.current.play();
          // Play bonus sound for big matches
          if (points >= 6) {
            const idx = Math.floor(Math.random() * bonusRefs.length);
            if (bonusRefs[idx].current) bonusRefs[idx].current.play();
          }
          // Check for level up
          if (newScore >= levelTargets[level - 1]) {
            setTimeout(() => {
              if (levelUpRef.current) levelUpRef.current.play();
            }, 300); // Delay for effect
            setLevel(l => l + 1);
            return 0; // Reset score for new level
          }
          return newScore;
        });
        setBoard(newBoard);
      }
    };

    const timer = setInterval(checkForMatches, 200);
    return () => clearInterval(timer);
  }, [board, level]);

  const isAdjacent = (idx1, idx2) => {
    const row1 = Math.floor(idx1 / width);
    const col1 = idx1 % width;
    const row2 = Math.floor(idx2 / width);
    const col2 = idx2 % width;
    return (
      (row1 === row2 && Math.abs(col1 - col2) === 1) ||
      (col1 === col2 && Math.abs(row1 - row2) === 1)
    );
  };

  const isMatchPresent = (board) => {
    // Check rows
    for (let i = 0; i < width * width; i++) {
      if (i % width <= width - 3) {
        const fruit = board[i];
        if (
          fruit &&
          fruit === board[i + 1] &&
          fruit === board[i + 2]
        ) {
          return true;
        }
      }
    }
    // Check columns
    for (let i = 0; i < width * (width - 2); i++) {
      const fruit = board[i];
      if (
        fruit &&
        fruit === board[i + width] &&
        fruit === board[i + width * 2]
      ) {
        return true;
      }
    }
    return false;
  };

  // Drag and drop logic
  const onDragStart = idx => setDraggedIdx(idx);
  const onDragOver = idx => setReplacedIdx(idx);
  const onDrop = () => {
    if (draggedIdx === null || replacedIdx === null) return;
    if (!isAdjacent(draggedIdx, replacedIdx)) {
      setDraggedIdx(null);
      setReplacedIdx(null);
      return;
    }
    const newBoard = [...board];
    [newBoard[draggedIdx], newBoard[replacedIdx]] = [newBoard[replacedIdx], newBoard[draggedIdx]];
    // Only allow swap if it creates a match
    if (isMatchPresent(newBoard)) {
      setBoard(newBoard);
      if (swapRef.current) swapRef.current.play();
    }
    setDraggedIdx(null);
    setReplacedIdx(null);
  };

  return (
    <div>
      {/* Sound elements */}
      <audio ref={swapRef} src={swapSound} />
      <audio ref={matchRef} src={matchSound} />
      <audio ref={levelUpRef} src={levelUpSound} />
      {bonusSounds.map((sound, idx) => (
        <audio key={idx} ref={bonusRefs[idx]} src={sound} />
      ))}
      <h2 className="font-bold text-xl mb-2">Candy Saga Game</h2>
      <div className="mb-2">
        <span className="font-bold">Level: {level}</span>
        <span className="ml-4">Score: <span className="font-bold">{score}</span> / {levelTargets[level - 1] || '∞'}</span>
      </div>
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${width}, 32px)`,
          gridTemplateRows: `repeat(${width}, 32px)`
        }}
      >
        {board.map((fruit, idx) => (
          <div
            key={idx}
            draggable
            onDragStart={() => onDragStart(idx)}
            onDragOver={e => { e.preventDefault(); onDragOver(idx); }}
            onDrop={onDrop}
            className="rounded shadow border flex items-center justify-center bg-white"
            style={{
              width: 32,
              height: 32,
              border: '2px solid #fff',
              cursor: 'grab'
            }}
          >
            <img src={fruit} alt="fruit" style={{ width: 28, height: 28, objectFit: 'cover' }} />
          </div>
        ))}
      </div>
      <div className="mt-2 text-sm text-gray-500">
        Drag fruits to swap and match 3 in a row or column!<br />
        Complete the score target to reach the next level.
      </div>
    </div>
  );
};

export default CandySagaGame;
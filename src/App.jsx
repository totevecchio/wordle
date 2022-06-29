import "./App.css";
import { useEffect, useState } from "react";
import wordsDb from "./word-db.json";

export default function App() {
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrenGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const handleType = (e) => {
      if (e.key === "Enter") {
        if (currentGuess.length !== 5) {
          return;
        }
        const newGuesses = [...guesses];
        newGuesses[guesses.findIndex((val) => val == null)] = currentGuess;
        setGuesses(newGuesses);
        setCurrenGuess("");

        const isCorrect = solution === currentGuess;
        if (isCorrect) {
          setIsGameOver(true);
        }
      }

      if (currentGuess.length >= 5) {
        return;
      }

      if (e.key === "Backspace") {
        setCurrenGuess(currentGuess.slice(0, -1));
        return;
      }

      setCurrenGuess(currentGuess + e.key);
    };

    window.addEventListener("keydown", handleType);

    return () => window.removeEventListener("keydown", handleType);
  }, [currentGuess, isGameOver, guesses, solution]);

  useEffect(() => {
    const fetchWord = () => {
      const words = wordsDb.data;
      const randomWord = words[Math.floor(Math.random() * words.length)];
      setSolution(randomWord.toLocaleLowerCase());
    };
    // fetch code for api recuest
    // const fetchWord = async () => {
    //   const response = await fetch('URL);
    //   const words = await response.json();
    //   const randomWord = words[Math.floor(Math.random() * words.length)];
    //   setSolution(randomWord);
    // };
    fetchWord();
  }, []);

  return (
    <>
      <div className="app">
        <h1 className="title">Wordle</h1>
        <div className="board">
          {guesses.map((guess, i) => {
            const isCurrentGuess =
              i === guesses.findIndex((val) => val == null);
            return (
              <Line
                key={i}
                guess={isCurrentGuess ? currentGuess : guess ?? ""}
                isFinal={!isCurrentGuess && guess != null}
                solution={solution}
              />
            );
          })}
        </div>
        <button onClick={() => window.location.reload()}>Restart</button>
      </div>
    </>
  );
}

export function Line({ guess, isFinal, solution }) {
  const tiles = [];

  for (let i = 0; i < 5; i++) {
    const char = guess[i];
    let className = "tile";

    if (isFinal) {
      if (char === solution[i]) {
        className += " correct";
      } else if (solution.includes(char)) {
        className += " close";
      } else {
        className += " incorrect";
      }
    }

    tiles.push(
      <div key={i} className={className}>
        {char}
      </div>
    );
  }

  return <div className="lines">{tiles}</div>;
}

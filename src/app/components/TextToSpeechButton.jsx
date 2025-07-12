'use client';

import { useEffect, useRef, useState } from 'react';

export default function TextToSpeechWithHighlight({ rawText }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [words, setWords] = useState([]);

  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);

  const utteranceRef = useRef(null);

  useEffect(() => {
    const cleaned = rawText
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    setWords(cleaned.split(' '));
  }, [rawText]);

  const speakWithHighlight = () => {
    const utterance = new SpeechSynthesisUtterance(words.join(' '));

    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentWordIndex(0);
    };

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIndex = event.charIndex;
        let index = 0;
        let count = 0;

        for (let i = 0; i < words.length; i++) {
          count += words[i].length + 1;
          if (count > charIndex) {
            index = i;
            break;
          }
        }
        setCurrentWordIndex(index);
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentWordIndex(-1);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentWordIndex(-1);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const pauseSpeech = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const resumeSpeech = () => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentWordIndex(-1);
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="flex gap-2 flex-wrap">
        {!isSpeaking && (
          <button
            onClick={speakWithHighlight}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            🔊 Play
          </button>
        )}
        {isSpeaking && !isPaused && (
          <button
            onClick={pauseSpeech}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
          >
            ⏸ Pause
          </button>
        )}
        {isSpeaking && isPaused && (
          <button
            onClick={resumeSpeech}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            ▶️ Resume
          </button>
        )}
        {isSpeaking && (
          <button
            onClick={stopSpeech}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            ⏹ Stop
          </button>
        )}
      </div>

      <div className="grid gap-2 text-sm">
        <label>
          🔁 Rate: {rate.toFixed(1)}
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-full"
          />
        </label>

        <label>
          🎼 Pitch: {pitch.toFixed(1)}
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="w-full"
          />
        </label>

        <label>
          🔊 Volume: {volume.toFixed(1)}
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full"
          />
        </label>
      </div>

      <div className="p-4 border bg-gray-50 rounded-md text-gray-800 leading-relaxed">
        {words.map((word, index) => (
          <span
            key={index}
            className={`transition-all ${
              index === currentWordIndex
                ? 'bg-yellow-200 text-black px-1 rounded'
                : ''
            }`}
          >
            {word + ' '}
          </span>
        ))}
      </div>
    </div>
  );
}

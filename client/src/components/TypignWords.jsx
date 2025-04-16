import React, { useEffect, useState } from 'react';
import './TypingWords.css'; // Assuming you have a CSS file for styling

const TypingWords = () => {
  const words = [
    "Analyzing your answers...",
    "Crunching numbers...",
    "Thinking deeply...",
    "Generating insights...",
    "Almost there..."
  ];

  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const currentWord = words[index];
    let charIndex = 0;

    const type = () => {
      if (charIndex < currentWord.length) {
        setText(currentWord.substring(0, charIndex + 1));
        charIndex++;
        setTimeout(type, 50);
      } else {
        setTyping(false);
        setTimeout(() => {
          setTyping(true);
          setIndex((prevIndex) => (prevIndex + 1) % words.length);
        }, 20000);
      }
    };

    if (typing) type();
  }, [index, typing]);

  return (
    <div style={{
        fontSize: '1rem', 
        
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '' // Ensures full viewport height for vertical centering
      }}>
        {text}
        <span className="blinking-cursor">|</span>
      </div>
      
  );
};

export default TypingWords;

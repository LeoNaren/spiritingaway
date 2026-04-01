"use client";
import { useState, useRef, useEffect } from "react";
import { addQuestion } from "../data/firestore";

function AskQuestion({ user }) {
  const [currentQuestion, setCurrentQuestion] = useState("");

  const [isSticky, setSticky] = useState(false);
  const askRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setSticky(!entry.isIntersecting);
      },
      { threshold: [0] },
    );
    if (askRef.current) observer.observe(askRef.current);
    return () => observer.disconnect();
  }, []);

  async function handleClick() {
    if (currentQuestion.trim() === "") return;
    if (!user) {
      alert("Please sign in to ask a questions");
    }

    await addQuestion(currentQuestion, "General", user);
    setCurrentQuestion("");
  }

  return (
    <>
      <div ref={askRef} style={{ height: "1px", marginBottom: "-1px" }} />
      <div className={`question-section ${isSticky ? "stuck" : "original"}`}>
        
          <input
            type="text"
            placeholder="Ask your question here..."
            onChange={(e) => setCurrentQuestion(e.target.value)}
            value={currentQuestion}
          />
          <button className="ask-button" onClick={handleClick}>
            Ask
          </button>
      </div>
    </>
  );
}

export default AskQuestion;

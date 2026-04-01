"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { listenToQuestions } from "../data/firestore";
import { getAnswersForQuestion } from "../data/firestore";
import ReactionButtons from "./Reactions";

function FeedCard({ question, user }) {
  const router = useRouter();
  const [topAnswer, setTopAnswer] = useState(null);

  useEffect(() => {
    async function fetchAnswer() {
      const fetchedAnswers = await getAnswersForQuestion(question.id);
      const top = fetchedAnswers[0] || null;
      setTopAnswer(top);
    }
    fetchAnswer();
  }, [question.id]);

  return (
    <div
      className="feed-card"
      onClick={() => router.push(`/question/${question.id}`)}
    >
      <h3 className="feed-question">{question.text}</h3>
      {topAnswer && (
        <div className="top-answer">
          <span className="answer-label">Top answer</span>
          <p className="answer-preview">{topAnswer.text}</p>
          <ReactionButtons answer={topAnswer} user={user} />
        </div>
      )}
    </div>
  );
}

function Feed({ user, recentQuestions = [] }) {
  const [questions, setQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState("trending");

  useEffect(() => {
    const unsubscribe = listenToQuestions(setQuestions);
    return () => unsubscribe();
  }, []);

  const sortedQuestions =
    activeTab === "trending"
      ? [...questions].sort((a, b) => b.answerCount - a.answerCount)
      : [...questions].sort((a, b) => {
          const aTime = a.askedAt?.toMillis?.() || 0;
          const bTime = b.askedAt?.toMillis?.() || 0;
          return bTime - aTime;
        });

  return (
    <div className="feed">
      <div className="feed-header">
        <button
          className={`feed-tab ${activeTab === "trending" ? "active" : ""}`}
          onClick={() => setActiveTab("trending")}
        >
          Trending
        </button>
        <button
          className={`feed-tab ${activeTab === "new" ? "active" : ""}`}
          onClick={() => setActiveTab("new")}
        >
          New
        </button>
        <button
          className={`feed-tab mobile-only ${activeTab === "recent" ? "active" : ""}`}
          onClick={() => setActiveTab("recent")}
        >
          Recent
        </button>
      </div>

      {activeTab === "recent"
        ? recentQuestions.map((q) => (
            <FeedCard key={q.id} user={user} question={q} />
          ))
        : sortedQuestions.map((question) => (
            <FeedCard key={question.id} user={user} question={question} />
          ))}
    </div>
  );
}

export default Feed;

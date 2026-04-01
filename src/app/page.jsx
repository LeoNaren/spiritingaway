"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

import WisdomDoc from "../components/HeroStack";
import AskQuestion from "../components/Question";
import Feed from "../components/Feed";
import RecentlyAsked from "../components/RecentlyAsked";

function Home() {
  const { user }= useAuth();
  const [postedQuestions, setPostedQuestions] = useState([]);

  function handleNewQuestion(newQuestion) {
    setPostedQuestions((prev) => [newQuestion, ...prev]);
    console.log(newQuestion);
  }

  return (
    <>
      <div className="page-body">
        <div>
          <WisdomDoc />
          <AskQuestion user={user} newQuestion={handleNewQuestion} />
          <Feed user={user} recentQuestions={postedQuestions} />
        </div>
        <aside className="side-column">
          <RecentlyAsked questions={postedQuestions} />
        </aside>
      </div>
    </>
  );
}

export default Home;

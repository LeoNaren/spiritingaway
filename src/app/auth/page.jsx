"use client";
import { useState } from "react"
import "./authPage.css"
import {auth} from "../../data/firebase"
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { useRouter } from "next/navigation"

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSubmit() {
    if (!email || !password) return
    if (!isLogin && !name) return
    setError("")

    try {
      if(isLogin) {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
      router.push("/")
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleGoogleLogin() {
    const provider = new GoogleAuthProvider()

    try {
      await signInWithPopup(auth, provider)
      router.push("/")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1 className="auth-logo">Spiritingaway</h1>
        <p className="auth-tagline">A place for questions that live in you.</p>

        <div className="auth-toggle">
          <button
            className={`toggle-btn ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
          >Login</button>
          <button
            className={`toggle-btn ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
          >Sign up</button>
        </div>

        {error && <p className="auth-error">{error}</p>}

        {!isLogin && (
          <input
            className="auth-input"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        )}

        <input
          className="auth-input"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button className="auth-submit" onClick={handleSubmit}>
          {isLogin ? "Login" : "Sign up"}
        </button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button className="google-btn" onClick={handleGoogleLogin}>
          Continue with Google
        </button>

        <p className="auth-switch">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign up" : "Login"}
          </span>
        </p>

      </div>
    </div>
  )
}

export default AuthPage
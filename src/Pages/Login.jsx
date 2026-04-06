import React, { useState } from "react";
import "./Login.css";
import { GiFilmProjector } from "react-icons/gi";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  async function handleSignup(email, password) {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup successful ✅");
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleLogin(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      alert("Login successful ✅");
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="logo-of-login">
          <GiFilmProjector /> CineScope
        </h1>

        <h2>{isSignup ? "Create Your Account" : "Welcome Back"}</h2>

        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();

            if (isSignup) {
              handleSignup(email, password);
            } else {
              handleLogin(email, password);
            }
          }}
        >
          {isSignup && <input type="text" placeholder="Enter Name" />}

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {isSignup && <input type="password" placeholder="Confirm Password" />}

          <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
        </form>

        <p className="signup-text">
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <span onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;

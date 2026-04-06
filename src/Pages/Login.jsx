import React, { useState } from "react";
import "./Login.css";
import { GiFilmProjector } from "react-icons/gi";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="logo-of-login">
          <GiFilmProjector /> CineScope
        </h1>

        <h2>{isSignup ? "Create Your Account" : "Welcome Back"}</h2>

        <form className="form">
          {isSignup && (
            <input type="text" placeholder="Enter Name" />
          )}

          <input type="email" placeholder="Enter Email" />
          <input type="password" placeholder="Enter Password" />

          {isSignup && (
            <input type="password" placeholder="Confirm Password" />
          )}

          <button type="submit">
            {isSignup ? "Sign Up" : "Login"}
          </button>
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
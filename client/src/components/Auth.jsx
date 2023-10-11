import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Logo from '../assets/logo.svg';

function Auth() {
  const [loginOrRegister, setLoginOrRegister] = useState('login');
  const navigate = useNavigate();

  // Check if already logged in, if yes, redirect to dashboard
  useEffect(() => {
    if (localStorage.getItem('id')) {
      navigate('/dashboard');
    }
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    const loginData = Object.fromEntries(new FormData(e.target));

    const response = await fetch('/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(loginData) });
    const data = await response.json();
    if (data.id) {
      localStorage.setItem('id', data.id);
      localStorage.setItem('token', data.token);
      navigate('/present/dashboard');
    } else {
      console.log(data.res);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    const registerData = Object.fromEntries(new FormData(e.target));

    const response = await fetch('/register', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(registerData) });
    const data = await response.json();
    if (data.id) {
      localStorage.setItem('id', data.id);
      localStorage.setItem('token', data.token);
      navigate('/present/dashboard');
    } else {
      console.log(data.res);
    }
  }

  return (
    <div className="Auth">
      <div>
        <img src={Logo} />
        {loginOrRegister === 'login' && (
          <>
            <form onSubmit={handleLogin}>
              <input type="email" name="email" placeholder="Email" required />
              <input type="password" name="password" placeholder="Password" required />
              <button type="submit">Login</button>
            </form><br />
            <button type="button" onClick={() => setLoginOrRegister('register')}>Register</button>
          </>
        )}
        {loginOrRegister === 'register' && (
          <>
            <form onSubmit={handleRegister}>
              <input type="email" name="email" placeholder="Email" required />
              <input type="text" name="name" placeholder="First name" required />
              <input type="password" name="password" placeholder="Password" required />
              <button type="submit">Register</button>
            </form><br />
            <button type="button" onClick={() => setLoginOrRegister('login')}>Login</button>
          </>
        )}
      </div>
    </div>
  )
}

export default Auth;

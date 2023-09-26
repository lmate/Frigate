import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

    const response = await fetch('/login', {method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify(loginData)});
    const data = await response.json();
    if (data.id) {
      localStorage.setItem('id', data.id);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } else {
      console.log(data.res);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    const registerData = Object.fromEntries(new FormData(e.target));

    const response = await fetch('/register', {method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify(registerData)});
    const data = await response.json();
    if (data.id) {
      localStorage.setItem('id', data.id);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } else {
      console.log(data.res);
    }
  }

  return (
    <div className="auth">
      {loginOrRegister === 'login' && (
        <>
          <form onSubmit={handleLogin}>
            <input type="email" name="email" placeholder="email" required/>
            <input type="password" name="password" placeholder="password" required/>
            <button type="submit">Login</button>
          </form><br />
          <button type="button" onClick={() => setLoginOrRegister('register')}>Register</button>
        </>
      )}
      {loginOrRegister === 'register' && (
        <>
          <form onSubmit={handleRegister}>
            <input type="email" name="email" placeholder="email" required/>
            <input type="text" name="name" placeholder="first name" required/>
            <input type="password" name="password" placeholder="password" required/>
            <button type="submit">Register</button>
          </form><br />
          <button type="button" onClick={() => setLoginOrRegister('login')}>Login</button>
        </>
      )}
    </div>
  )
}

export default Auth;

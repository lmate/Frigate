import { useState } from 'react';
import logo from './assets/logo.svg';
import './App.css';
import Editor from './components/Editor';
import Dashboard from './components/Dashboard';

function App() {
  const [isEditing, setIsEditing] = useState(/*null*/ true);

  return (
    <>
      {isEditing ? (
        <Editor />
      ) : (
        <Dashboard />
      )}
    </>
  )
}

export default App

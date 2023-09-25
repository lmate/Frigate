import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Editor from './components/Editor';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';

import './App.css';

const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/edit",
    element: <Editor />
  },
  {
    path: "/auth",
    element: <Auth />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <RouterProvider router={router} />
  </>,
)

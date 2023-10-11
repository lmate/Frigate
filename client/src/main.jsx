import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

import Editor from './components/Editor';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import Present from './components/Present';

import './AppV2.css';

const router = createBrowserRouter([
  {
    path: "/present/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/present/edit/:presentationid",
    element: <Editor />
  },
  {
    path: "/present/present/:presentationid",
    element: <Present />
  },
  {
    path: "/auth",
    element: <Auth />
  },
  {
    path: "*",
    element: <Navigate to="/present/dashboard" />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <RouterProvider router={router} />
  </>,
)

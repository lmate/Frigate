import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Editor from './components/Editor';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';

import './AppV2.css';

const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/edit/:presentationid",
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

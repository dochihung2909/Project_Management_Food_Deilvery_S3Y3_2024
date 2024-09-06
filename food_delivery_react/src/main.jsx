import { StrictMode } from 'react' 
import App from './App.jsx'
import './index.css'

import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";


const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <App></App>
    ),
  }, 
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)

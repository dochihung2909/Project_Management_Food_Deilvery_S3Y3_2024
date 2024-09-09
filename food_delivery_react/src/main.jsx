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
import { UserProvider } from './contexts/UserContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';


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
      <UserProvider>
          <GoogleOAuthProvider clientId="1026719700159-cj1sq0dvesgoj6qu2944rr6qft24gbi2.apps.googleusercontent.com">
            <RouterProvider router={router} />  
          </GoogleOAuthProvider>
      </UserProvider>
    </ThemeProvider>
  </StrictMode>,
)

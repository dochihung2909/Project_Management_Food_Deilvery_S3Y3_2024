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
import { UserProvider, useUser } from './contexts/UserContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import FoodDetails from './components/Food/FoodDetails.jsx';
import AppLayout from './components/Layout/AppLayout.jsx';
import Login from './components/Login/Login.jsx';
import Register from './components/Login/Register.jsx';
import LoginPage from './components/Login/LoginPage.jsx';
import RestaurantDetail from './components/Restaurant/RestaurantDetail.jsx';
import { CartProvider } from './contexts/CartContext.jsx';
import Payment from './components/Payment/PaymentPage.jsx';
import PaymentPage from './components/Payment/PaymentPage.jsx';
import RestaurantEdit from './components/Restaurant/RestaurantEdit.jsx';
import PaymentSuccess from './components/Payment/PaymentSuccess.jsx';
import OrderHistory from './components/OrderHistory/OrderHistory.jsx';
import User from './components/User/User.jsx';


const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: (
          <App></App>
        ),
      },
      {
        path: "/food/:id",
        element: (
          <FoodDetails></FoodDetails>
        ),
      },
      {
        path: "/restaurant/:id",
        element: (
          <RestaurantDetail></RestaurantDetail>
        ),
      },
      {
        path: "/payment-success",
        element: (
          <PaymentSuccess></PaymentSuccess>
        ),
      },
      {
        path: "/my-orders",
        element: (
          <OrderHistory></OrderHistory>
        ),
      },
      {
        path: "/user",
        element: (
          <User></User>
        ),
      },
    ]
  },
  {
    path: "/restaurant-management",
    element: (
      <RestaurantEdit></RestaurantEdit>
    ),
  },
  {
    path: "/register",
    element: (
      <Register></Register>
    ),
  },
  {
    path: "/login",
    element: (
      <LoginPage></LoginPage>
    ),
  },
  {
    path: "/payment",
    element: (
      <PaymentPage />
    ),
  },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <UserProvider>
        <CartProvider>
          <GoogleOAuthProvider clientId="1026719700159-cj1sq0dvesgoj6qu2944rr6qft24gbi2.apps.googleusercontent.com">
            <RouterProvider router={router} />
          </GoogleOAuthProvider>
        </CartProvider>
      </UserProvider>
    </ThemeProvider>
  </StrictMode>,
)

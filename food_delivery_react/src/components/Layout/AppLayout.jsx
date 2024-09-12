import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import { useUser } from '../../contexts/UserContext';


export default function AppLayout() { 

  return (
    <>
        <Header></Header>
        <Outlet></Outlet> 
    </>
  )
}

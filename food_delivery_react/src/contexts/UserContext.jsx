import React, { createContext, useState, useEffect, useReducer } from 'react';
import { UserReducer } from '../states/reducers/UserReducer';
import Cookies from 'js-cookie';

export const UserContext = createContext();

export const UserProvider = ({ children }) => { 
    const [user, dispatch] = useReducer(UserReducer, null)

    const login = async (userData) => {
        dispatch({ type: 'login', payload: userData });
    };
      
    const update = async (userData) => {
        dispatch({ type: 'update', payload: userData }); 
    };  

    const logout = async () => { 
        setTimeout(() =>{
            dispatch({ type: 'logout' });
            Cookies.remove('access_token')
            Cookies.remove('refresh_token')
            console.log(Cookies.get('access_token'))
            console.log('logged out'); 
        }, 100)
    };

    return (
        <UserContext.Provider value={{ user, login, logout, dispatch, update }}>
            {children}
        </UserContext.Provider>
    );
}; 

export const useUser = () => React.useContext(UserContext);
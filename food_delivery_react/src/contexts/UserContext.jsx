import React, { createContext, useState, useEffect, useReducer, useContext } from 'react';
import { UserReducer } from '../states/reducers/UserReducer';
import Cookies from 'js-cookie';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {    
    const [user, dispatch] = useReducer(UserReducer, null) 
    
    const BASE_URL = import.meta.env.VITE_BASE_URL 
    
    const accessToken = Cookies.get('access_token')

    console.log(accessToken)

     

    const handleAuthenticateUser = async () => {
        const refreshToken = Cookies.get('refresh_token') 
 
        const response = await fetch(BASE_URL + 'users/current-user/', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })  

        console.log(await response.status)
         
        if (response.status == 200) {
            const data = await response.json() 
            console.log(data)
            login(data) 
            console.log('login success')
        } else if (response.status == 400) {
            const res = await fetch(BASE_URL + 'token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refresh_token: refreshToken
                })
            })

            if (res.status == 200) {
                const data = await res.json()
                Cookies.set('access_token', data.access_token, { expires: 7 })
                const response = await fetch(BASE_URL + 'users/current-user/', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + accessToken
                    }
                })
                if (response.status == 200) {
                    const data = await response.json()
                    login(data) 
                }
            }
        }
    }

    useEffect(() => {
        handleAuthenticateUser()
        console.log('handle AuthenticateUser')
    }, []) 


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

export const useUser = () => useContext(UserContext);
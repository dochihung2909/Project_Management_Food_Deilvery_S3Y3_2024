import { Button, IconButton } from '@material-tailwind/react'
import React, { useCallback, useReducer } from 'react'

import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode"; 
import Cookies from 'js-cookie'; 
import { UserReducer } from '../../states/reducers/UserReducer';
import { useUser } from '../../contexts/UserContext';

export default function Login({setOpenLogin}) { 
    const { user, login } = useUser()

    const apiUrl = import.meta.env.VITE_API_URL 

    const getAuthToken = async (credentialResponseDecoded) => {
        await fetch( apiUrl + '/login/', {
                method: 'POST', 
                body: JSON.stringify({
                    email: credentialResponseDecoded.email,
                    first_name: credentialResponseDecoded.family_name,
                    last_name: credentialResponseDecoded.given_name, 
                    avatar: credentialResponseDecoded.picture 
                })
            })
            .then(response => response.json())
            .then(data => { 
                Cookies.set('access_token', data.access, { expires: 7 })
                Cookies.set('refresh_token', data.refresh, { expires: 7 })
                let newUser = {
                    email: credentialResponseDecoded.email,
                    first_name: credentialResponseDecoded.family_name,
                    last_name: credentialResponseDecoded.given_name,
                    avatar: credentialResponseDecoded.picture 
                }  

                login(newUser) 
            })
    }


    const onGoogleLoginSuccess = useCallback(
        credentialResponse => {
            let credentialResponseDecoded = jwtDecode(credentialResponse.credential)  
            getAuthToken(credentialResponseDecoded)  
        }
    )

    

  return (
    <> 
    {/* {user ?   
        <div>
            <image src={user.avatar} />
        </div>
    : 
        }
         */}

<div className='flex items-center justify-center absolute top-0 bottom-0 left-0 right-0 bg-gray-300 z-30 bg-opacity-50'>
            <div className='w-1/3 bg-white h-1/3 p-4 rounded-xl'> 
                <div className='ml-auto w-full flex items-end flex-col'> 
                    <IconButton className='bg-transparent shadow-none rounded-full' onClick={setOpenLogin}>
                        <i className="text-gray-700 text-xl fa-solid fa-xmark"></i>
                    </IconButton>
                </div>
                <h1 className='text-center text-xl font-semibold'>Luyện thi Ielts</h1>

                <div className='flex items-center justify-center mt-8 px-10'>  
                    <GoogleLogin
                        onSuccess={onGoogleLoginSuccess}
                        onError={() => {
                            console.log('Login Failed')
                        }}
                    />
                </div>

            </div>
        </div>
    </>
    
    
  )
}

import React, { useEffect, useState } from 'react'
import SideBar from './SideBar'
import BoardView from './BoardView'
import { useNavigate, useParams } from 'react-router-dom'; 
import { useUser } from '../../contexts/UserContext';
import Cookies from 'js-cookie';


const RestaurantEdit = () => {
    const { user } = useUser()
    const navigate = useNavigate()

    const [restaurant, setRestaurant] = useState({}); 
    const BASE_URL = import.meta.env.VITE_BASE_URL; 
    const [selecting, setSelecting] = useState('Foods');
    const accessToken = Cookies.get('access_token')

    useEffect(() => { 
        if (user) {
            if (user?.role == 2 || user?.role == 3) { 
                getRestaurant(); 
            } else {
                navigate('/login')
            }
        }
    }, [user]) 

    useEffect(() => {
        console.log(selecting);
    }, [selecting])

    const getRestaurant = async () => {
        const response = await fetch(BASE_URL + 'users/current-user/restaurant', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })

        if (response.status == 200) {
            const data = await response.json();
            setRestaurant(data);
        }
    }  

    function round(value, step) {
        step || (step = 1.0);
        var inv = 1.0 / step;
        return Math.round(value * inv) / inv;
    }

    return (
        <div className='w-full h-full py-4 px-8'>
            <div className='bg-white py-12 w-3/4 mx-auto'>
                <div className='container mx-auto'>
                    <h1 className='text-4xl my-4 font-semibold'>{restaurant?.name}</h1>
                    <p className='my-4'>{restaurant?.category}</p>
                    <div className='flex'>
                        <p className='mr-4'><i className="text-yellow-500 fa-solid fa-star"></i>{round(restaurant?.rating, 0.5)}</p>
                        <p className=''>{restaurant?.address}</p>
                    </div>
                </div>
            </div>

            <div className='border-t border-gray-500' />

            <div className='w-full flex'>
                <div className='w-1/5'>
                    <SideBar handleSelect={(barItem) => setSelecting(barItem)} />
                </div>
                <div className='w-4/5'>
                    <BoardView restaurant={restaurant} getRestaurant={getRestaurant} foods={restaurant?.foods} selecting={selecting} />
                </div>
            </div>
        </div>
    )
}

export default RestaurantEdit
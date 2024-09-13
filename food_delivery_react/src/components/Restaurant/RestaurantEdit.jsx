import React, { useEffect, useState } from 'react'
import SideBar from './SideBar'
import BoardView from './BoardView'
import { useParams } from 'react-router-dom';



const RestaurantEdit = () => {
    const [restaurant, setRestaurant] = useState({});
    const [foodNextPage, setFoodNextPage] = useState('');
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const { id } = useParams();

    useEffect(() => {
        getFoods();
        console.log(id);
    }, [])

    const getFoods = async () => {
        const response = await fetch(BASE_URL + '/restaurants/' + id, {
            method: 'GET',
        })

        if (response.status == 200) {
            const data = await response.json();
            console.log(data);
            setRestaurant(data);
        }

    }

    function round(value, step) {
        step || (step = 1.0);
        var inv = 1.0 / step;
        return Math.round(value * inv) / inv;
    }

    return (
        <div className='w-full h-full p-2'>
            <div className='bg-white py-12'>
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
                    <SideBar />
                </div>
                <div className='w-4/5'>
                    <BoardView foods={restaurant?.foods} />
                </div>
            </div>
        </div>
    )
}

export default RestaurantEdit
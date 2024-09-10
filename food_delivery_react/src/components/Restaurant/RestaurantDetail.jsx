import { Button, Carousel } from '@material-tailwind/react'
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import FoodCard from '../Cards/FoodCard'
import { useUser } from '../../contexts/UserContext'
import { useCart } from '../../contexts/CartContext'

export default function RestaurantDetail() {
    const { state} = useLocation()
    const { restaurant } = state 

    const { user } = useUser()

    const { setCart } = useCart()

    const BASE_URL = import.meta.env.VITE_BASE_URL

    useEffect(() => { 

        handleGetCartData()

    }, []) 

    const handleGetCartData = async () => {
        if (user && restaurant) {
            await fetch(BASE_URL + 'carts/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    restaurant: restaurant.id,
                    user: user.id
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log(data) 
            })
        }
    }

  return (
    <>
        <div className='bg-white py-12'>
            <div className='container mx-auto'>
                <h1 className='text-4xl my-4 font-semibold'>{restaurant.name}</h1>
                <p className='my-4'>{restaurant.category}</p>
                <div className='flex'>
                    <p className='mr-4'><i className="text-yellow-500 fa-solid fa-star"></i> {restaurant.rating} </p>
                    <p className=''>{restaurant.address}</p>
                </div>  
            </div>  
        </div>
        <div className='bg-secondary pt-2'>
            <div className='container mx-auto'>
                <div className=''> 
                    <h1 className='text-4xl my-4 font-semibold'>Ưu đãi hôm nay</h1>
                    <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4'>
                        {restaurant.foods.map((food, index) => {
                            return (
                                <FoodCard key={index} food={food}></FoodCard>
                            )
                        })} 
                    </div>
                </div> 
            </div> 
        </div>

    </>
  )
}

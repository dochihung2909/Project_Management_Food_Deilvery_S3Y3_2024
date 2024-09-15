import { Button, Carousel } from '@material-tailwind/react'
import React, { useEffect, useLayoutEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import FoodCard from '../Cards/FoodCard'
import { useUser } from '../../contexts/UserContext'
import { useCart } from '../../contexts/CartContext'

export default function RestaurantDetail() {  
    const { state } = useLocation()
    const { restaurant } = state 

    const { user } = useUser()

    const { cart, handleGetCartInfo } = useCart()

    const BASE_URL = import.meta.env.VITE_BASE_URL

    useLayoutEffect(() => { 
        handleGetCartData()  
    }, [user])

    const handleGetCartData = async () => {  
        if (user && restaurant) {
            handleGetCartInfo(user.id, restaurant.id)
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

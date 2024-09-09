import { Button, Carousel } from '@material-tailwind/react'
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import FoodCard from '../Cards/FoodCard'

export default function RestaurantDetail() {
    const { state} = useLocation()
    const { restaurant } = state 

    useEffect(() => {
        console.log(restaurant)
    }, []) 

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
                    <div className='grid grid-cols-3 gap-4'>
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

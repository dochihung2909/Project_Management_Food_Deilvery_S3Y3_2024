import { Button } from '@material-tailwind/react'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FoodCard from '../Cards/FoodCard'
import FoodCartCard from '../Cards/FoodCartCard'
import FoodPaymentCard from '../Cards/FoodPaymentCard'

export default function OrderCard({restaurant, cart, method, status}) {
    const navigate = useNavigate()

    const handleNavigateToRestaurant = () => {
        navigate(`/restaurant/${restaurant.id}/`, {state: {
            restaurant: restaurant,
        }})
    }

  return (
    <div className='my-4'>
        <div className='flex justify-between mb-8'>
            <div className='flex'>
                <h2 className='font-semibold'>{restaurant.name}</h2>
                <div className='ml-2'> 
                    <Link className='p-2 border-2 border-gray-300 rounded-lg' onClick={handleNavigateToRestaurant}>
                        Xem shop
                    </Link>
                </div>
            </div>
            <div className='flex gap-2'>
                <p>
                    {method}  
                </p>
                <p>
                    {status} 
                </p>
            </div>
        </div>
        <div>
            {cart.cart_details.map((c,index) => {
                return (<FoodPaymentCard food={c} key={index}></FoodPaymentCard>)
            })}
        </div>
    </div>
  )
}

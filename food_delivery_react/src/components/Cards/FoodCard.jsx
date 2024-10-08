import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import { Spinner } from "@material-tailwind/react";
import { formatCurrencyVND } from '../../utils/currency';
import Loading from '../Loading/Loading';
import { useCart } from '../../contexts/CartContext';
import { useUser } from '../../contexts/UserContext';


export default function FoodCard({ food }) {
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL

  const { user } = useUser()

  const [isLoading, setIsLoading] = useState(false)

  const { cart, add } = useCart()


  const handleNavigateFood = () => {
    navigate(`/food/${food.id}/`, {
      state: {
        food: food,
      }
    })
  }

  const handleAddFoodToCart = async (e) => {
    e.stopPropagation()
    add({ ...food, quantity: 1 })

    // if (user) {  
    //   console.log(user, food)
    //   await fetch(BASE_URL + 'carts/', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //       user: user.id,
    //       restaurant: food.restaurant
    //     })
    //   })
    //     .then(response => response.json())
    //     .then(data => {
    //       console.log('cart', data)
    //       addFoodToCart(data.id, food.id) 
    //     })
    // }
  }

  return (
    <>
      <Card onClick={handleNavigateFood} className="mt-6 w-full cursor-pointer grid grid-cols-3 p-4">
        <CardHeader color="blue-gray" className="relative h-32 w-32 m-0">
          <img
            className='object-cover h-32 w-32'
            src={food.image}
            alt="card-image"
          />
        </CardHeader>
        <CardBody className='col-span-2 p-2'>
          <Typography variant="h5" color="blue-gray" className="mb-2">
            {food?.name}
          </Typography>
          <div className='mb-2'>
            {food?.description}
          </div>
          <div className='mb-2'>
            {food.rating > 0 ? <p><i className="text-yellow-500 fa-solid fa-star"></i> {food.rating} </p> : <p>Chưa có đánh giá</p>}
          </div>
          <div className='flex'>
            <div className='flex items-center'>
              <p className='text-primary text-lg mr-2'>{formatCurrencyVND(food.price - food.discount)}</p>
              <p className='line-through'>{formatCurrencyVND(food.price)}</p>
            </div>
            <IconButton onClick={handleAddFoodToCart} className='ml-auto bg-primary rounded-full'>
              <i className="text-white fa-solid fa-plus"></i>
            </IconButton>
          </div>
        </CardBody>
      </Card>
      {isLoading && <Loading />}
    </>
  );
}

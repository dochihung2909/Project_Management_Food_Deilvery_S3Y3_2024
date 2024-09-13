import { IconButton } from '@material-tailwind/react'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useCart } from '../../contexts/CartContext'
import { formatCurrencyVND } from '../../utils/currency'

export default function FoodCartCard({setCart,food}) {  

    const { cart, add, remove } = useCart()   

    const [quantity, setQuantity] = useState(food.quantity)     
 

    const handleMinus = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1)  
            remove({...food.food, quantity: -1})  
            setCart(cart.amount)
            console.log(cart) 
        }
    }

    const handleAdd = () => { 
        setQuantity(quantity + 1)  
        add({...food.food, quantity: 1})  
        setCart(cart.amount)
    } 

    useEffect(() => { 
        setQuantity(food.quantity) 
    }, [food])

  return (
    <div className='flex my-2'>
        <div className='mr-4'>
            <div className='flex items-center'>
                <button className='p-2' onClick={handleMinus}>
                    <i className="text-primary fa-solid fa-minus"></i>
                </button>
                <p className='mx-2'>{quantity}</p>
                <button className='p-2' onClick={handleAdd}>
                    <i className="text-primary fa-solid fa-plus"></i>
                </button>
            </div> 
        </div>

        <div className='flex'>
            <img src='https://food-cms.grab.com/compressed_webp/items/VNITE2024052812253296718/detail/menueditor_item_26a319d791a44987ab48c7ac4ce7e09f_1716899114449637637.webp' 
                className='h-14 w-14 rounded-lg' />
            <div className='mx-4'>
                <p className='text-lg font-medium'>
                    {food.food.name}
                </p>
                <p className='text-md text-gray-500'>
                    {food.food.description}
                </p>
            </div>
        </div>

        <div className='ml-auto'>
            <div className='flex flex-col justify-end items-end'>
                <p className='text-primary text-lg'>{formatCurrencyVND((food.food.price - food.food.discount) * quantity)} </p>
                <p className='line-through'>{formatCurrencyVND(food.food.price)} </p> 
            </div> 
        </div>


    </div>
  )
}

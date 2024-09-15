import React from 'react'
import { formatCurrencyVND } from '../../utils/currency'

export default function FoodPaymentCard({food}) {
  return (
    <div className='flex my-2'>
        <div className='flex items-center mr-2'>
            {food.quantity}x
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
                <p className='text-primary text-lg'>{formatCurrencyVND((food.food.price - food.food.discount) * food.quantity)} </p>
                <p className='line-through'>{formatCurrencyVND(food.food.price)} </p> 
            </div> 
        </div> 
    </div>
  )
}

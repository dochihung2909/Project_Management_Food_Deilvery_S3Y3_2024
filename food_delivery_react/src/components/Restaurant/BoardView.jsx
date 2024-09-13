import React, { useEffect } from 'react'


const BoardView = ({ foods = [] }) => {
    useEffect(() => {
        console.log(foods)
    }, [])
    const Card = ({ food, onEdit, onDelete }) => {
        return (
            <div className='w-full flex px-2 space-x-4 items-center border-b border-gray-300 py-2 hover:bg-gray-200'>
                <div className='flex-1'>
                    <p className='text-lg font-semibold'>{food?.name}</p>
                    <p className='text-sm text-gray-600'>{food?.category}</p>
                </div>
                <p className='text-lg font-semibold text-green-600'>{food?.price} $</p>
                <div className='space-x-2'>
                    <button
                        onClick={() => onEdit(food)}
                        className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md'
                    >
                        Sửa
                    </button>
                    <button
                        onClick={() => onDelete(food)}
                        className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md'
                    >
                        Xóa
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div>
            {foods.map((food, index) => (
                <Card food={food} key={index} />
            ))}
        </div>
    )
}

export default BoardView
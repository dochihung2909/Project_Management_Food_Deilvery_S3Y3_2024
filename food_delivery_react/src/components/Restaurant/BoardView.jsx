import React, { useEffect, useState } from 'react'
import { formatCurrencyVND } from '../../utils/currency'


const BoardView = ({ foods = [], employees = [], selecting }) => {
    useEffect(() => {
        console.log(foods)
        console.log(employees);
    }, [])
    const Card = ({ food, employee, onEdit, onDelete }) => {
        // console.log(food, food.name);
        console.log(employee);
        // console.log(selecting);
        return (
            <>
                {selecting === 'Foods' ? (
                    <div className='w-full flex px-2 space-x-4 items-center border-b border-gray-300 py-2 hover:bg-gray-200'>
                        <div className='flex-2'>
                            <img className='w-10 h-10 rounded-full' src={food?.image} />
                        </div>
                        <div className='flex-1'>
                            <p className='text-lg font-semibold'>{food?.name}</p>
                            <p className='text-sm text-gray-600'>{food?.category}</p>
                        </div>
                        <p className='text-lg font-semibold text-green-600'>{formatCurrencyVND(food?.price)}</p>
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
                ) : (
                    <div className='w-full flex px-2 space-x-4 items-center border-b border-gray-300 py-2 hover:bg-gray-200'>
                        <div className='flex-2'>
                            <img className='w-10 h-10 rounded-full' src={employee?.image} />
                        </div>
                        <div className='flex-1'>
                            <p className='text-lg font-semibold'>{employee?.first_name || "first name"}</p>
                        </div>
                        <div className='flex-1'>
                            <p className='text-lg font-semibold'>{employee?.last_name || "last name"}</p>
                        </div>
                        <div className='flex-1'>
                            <p className='text-lg font-semibold'>{employee?.phone_number || "first name"}</p>
                        </div>
                        <div className='space-x-2'>
                            <button
                                onClick={() => onEdit(employee)}
                                className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md'
                            >
                                Sửa
                            </button>
                            <button
                                onClick={() => onDelete(employee)}
                                className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md'
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                )}
            </>
        )
    }

    return (
        <>
            {selecting === 'Foods' ? (
                <div>
                    {foods.map((food, index) => (
                        <Card food={food} key={index} />
                    ))}
                </div>
            ) : (
                <div>
                    {employees.map((employee, index) => (
                        <Card employee={employee} key={index} />
                    ))}
                </div>
            )}
        </>
    )
}

export default BoardView
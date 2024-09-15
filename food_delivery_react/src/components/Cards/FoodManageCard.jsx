import React, { useState } from 'react'
import Dialog from '../Restaurant/Dialog'
import { formatCurrencyVND } from '../../utils/currency';

const FoodManageCard = ({ food }) => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [isOpen, setIsOpen] = useState(false);
    const getFood
    const handleConfirm = () => {

    }

    const handleCancel = () => {
        setIsOpen(false);
    }
    const editClick = () => {
        setIsOpen(true);

    };
    const deleteClick = () => {
        setIsOpen(true);
        console.log(isOpen)
    };

    return (
        <>
            <Dialog
                msg={`Bạn có muốn xóa món ${food?.name} không?`}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                isOpen={isOpen}
            />
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
                        onClick={editClick}
                        className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md'
                    >
                        Sửa
                    </button>

                    <button
                        onClick={deleteClick}
                        className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md'
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </>
    )
}

export default FoodManageCard
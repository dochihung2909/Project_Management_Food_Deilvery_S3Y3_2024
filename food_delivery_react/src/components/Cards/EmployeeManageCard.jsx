import React, { useState } from 'react'
import Dialog from '../Restaurant/Dialog'

const EmployeeManageCard = ({ employee }) => {
    const [isOpen, setIsOpen] = useState(false);
    const editClick = () => {
        setIsOpen(true);
        console.log(employee)
    };
    const deleteClick = () => {
        setIsOpen(true);
    }
    return (
        <>
            <Dialog
                msg={`Bạn có muốn xóa nhân viên ${employee?.first_name} ${employee?.last_name}` || employee?.username}
                isOpen={isOpen}
            />
            <div className='w-full flex px-2 space-x-4 items-center border-b border-gray-300 py-2 hover:bg-gray-200'>
                <div className='flex-2'>
                    <img className='w-10 h-10 rounded-full' src={employee?.image} />
                </div>
                <div className='flex-1'>
                    <p className='text-lg font-semibold'>{employee?.username || ""}</p>
                </div>
                <div className='flex-1'>
                    <p className='text-lg font-semibold'>{employee?.first_name || ""}</p>
                </div>
                <div className='flex-1'>
                    <p className='text-lg font-semibold'>{employee?.last_name || ""}</p>
                </div>
                <div className='flex-1'>
                    <p className='text-lg font-semibold'>{employee?.phone_number || ""}</p>
                </div>
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

export default EmployeeManageCard
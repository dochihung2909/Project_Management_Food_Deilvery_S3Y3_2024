import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@material-tailwind/react';
import React, { useState } from 'react'

const EmployeeManageCard = ({ employee }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);

    const editClick = () => {
        setIsOpen(true);
        console.log(employee)
    };

    const handleConfirmEditEmployee = () => {

    }
    const deleteClick = () => {
        setIsOpen(true);
    }
    return (
        <>
            <Dialog open={isOpen} handler={() => setIsOpen(!isOpen)}>
                <DialogHeader>Its a simple dialog.</DialogHeader>
                <DialogBody>
                    The key to more success is to have a lot of pillows. Put it this way,
                    it took me twenty five years to get these plants, twenty five years of
                    blood sweat and tears, and I&apos;m never giving up, I&apos;m just
                    getting started. I&apos;m up to something. Fan luv.
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={() => setIsOpen(false)}
                        className="mr-1"
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" color="green" onClick={handleConfirmEditEmployee}>
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>

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
                        onClick={() => setIsOpen(true)}
                        className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md'
                    >
                        Sửa
                    </button>
                    <button
                        onClick={() => setIsOpenDelete(true)}
                        className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md'
                    >
                        Xóa
                    </button>
                </div>
            </div >
        </>
    )
}

export default EmployeeManageCard
import React from 'react'
import { MdFastfood, MdOutlineAddTask, MdPeople } from 'react-icons/md'

const linkData = [
    {
        label: "Foods",
        link: "foods",
        icon: <MdFastfood />
    },
    {
        label: "Employees",
        link: "employees",
        icon: <MdPeople />
    },
]

const SideBar = () => {
    const Card = ({ name, price }) => {
        return (
            <div className='w-full h-32 bg-white p-5 shadow-md rounded-md flex items-center justify-between'>
                <div className='h-full flex flex-1 flex-col justify-between'>
                    <p className='text-base text-gray-600'>{name}</p>
                    <span className='text-2xl font-semibold'>{price}</span>
                </div>

                <Button
                    className='text-blue-600 hover:text-blue-500 font-semibold sm:px-0'
                    label='Edit'
                    type='button'
                    onClick={() => editClick(user)}
                />

                <Button
                    className='text-red-700 hover:text-red-500 font-semibold sm:px-0'
                    label='Delete'
                    type='button'
                    onClick={() => deleteClick(user?._id)}
                />
            </div>
        )
    }

    return (
        <div className='w-full h-full flex flex-col gap-6 p-5'>
            <h1 className='flex gap-1 items-center'>
                <span className='text-2xl font-bold text-black'>Quản lý</span>
            </h1>
            <div className=''>
                {linkData.map((data, index) => (
                    <div className='flex items-center gap-3 hover:bg-gray-200 py-4 px-2'>
                        {data?.icon}
                        <p className='text-lg'>{data?.label}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SideBar
import React from 'react'
import { MdFastfood, MdOutlineAddTask, MdPeople } from 'react-icons/md'
import { FaCartArrowDown } from "react-icons/fa";

const linkData = [
    {
        label: "Foods",
        link: "foods",
        icon: <MdFastfood />
    },
    {
        label: "Orders",
        link: "orders",
        icon: <FaCartArrowDown />
    },
]

const SideBar = ({ handleSelect }) => {
    return (
        <div className='w-full h-full flex flex-col gap-6 p-5'>
            <h1 className='flex gap-1 items-center'>
                <span className='text-2xl font-bold text-black'>Quản lý</span>
            </h1>
            <div className=''>
                {linkData.map((data, index) => (
                    <div
                        className='flex items-center gap-3 hover:bg-gray-200 py-4 px-2'
                        onClick={() => {
                            handleSelect(data.label);
                        }}
                    >
                        {data?.icon}
                        <p className='text-lg'>{data?.label}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SideBar
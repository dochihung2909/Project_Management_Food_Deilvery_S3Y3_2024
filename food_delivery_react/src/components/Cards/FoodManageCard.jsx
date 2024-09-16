import React, { useEffect, useState } from 'react' 
import { formatCurrencyVND } from '../../utils/currency';
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Option, Select } from '@material-tailwind/react';
import Cookies from 'js-cookie';

const FoodManageCard = ({ food, getRestaurant }) => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [isOpen, setIsOpen] = useState(false);  
    const [isOpenDelete, setIsOpenDelete] = useState(false); 

    const accessToken = Cookies.get('access_token');

    const [foodInfo, setFoodInfo] = useState({
        name: food.name,
        price: food.price,
        discount: food.discount,
        category: food.category,
        description: food.description,
        image: food.image 
    })
  
    const handleEditFoodConfirm = async () => { 
        const response = await fetch(BASE_URL + `foods/${food.id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                name: foodInfo.name
            })
        })

        if (response.status == 200) {
            const data = await response.json() 
            if (data) {
                getRestaurant() 
                setIsOpen(false)
            }
        }
    } 

    useEffect(() => {
        console.log(foodInfo)
    }, [foodInfo])

    const handleDeleteFoodConfirm = async () => {
        
    }

    return (
        <> 
            <Dialog open={isOpen} handler={() => setIsOpen(!isOpen)}>
                <DialogHeader>Sửa thông tin món ăn</DialogHeader>
                <DialogBody>
                    <div className='flex gap-2'>
                        <label htmlFor='foodName'>Tên món ăn</label>
                        <input name='foodName' value={foodInfo.name} onChange={(e) => {
                            setFoodInfo((prevFoodInfo) => {
                                return {...prevFoodInfo, name: e.target.value}
                            })
                        }} id='foodName' type='text' placeholder='Tên món ăn'></input>
                    </div>
                    {/* <div className='flex gap-2'>
                        <label htmlFor='foodName'>Giá</label>
                        <input id='foodName' type='text' placeholder='Tên món ăn'></input>
                    </div> */}
                    <div className="flex">
                        <Select label="Select Version">
                            <Option>Material Tailwind HTML</Option>
                            <Option>Material Tailwind React</Option>
                            <Option>Material Tailwind Vue</Option>
                            <Option>Material Tailwind Angular</Option>
                            <Option>Material Tailwind Svelte</Option>
                        </Select>
                    </div>   
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
                    <Button variant="gradient" color="green" onClick={handleEditFoodConfirm}>
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>

            <Dialog size='sm' open={isOpenDelete} handler={() => setIsOpenDelete(!isOpenDelete)}>
                <DialogHeader>Bạn có muốn xoá món ăn này?</DialogHeader>
                <DialogBody>
                    Xác nhận xoá món ăn {food.name}
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="black"
                        onClick={() => setIsOpenDelete(false)}
                        className="mr-1"
                    >
                        <span>Huỷ</span>
                    </Button>
                    <Button variant="gradient" color="red" onClick={handleDeleteFoodConfirm}>
                        <span>Xoá</span>
                    </Button>
                </DialogFooter>
            </Dialog>

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
            </div>
        </>
    )
}

export default FoodManageCard
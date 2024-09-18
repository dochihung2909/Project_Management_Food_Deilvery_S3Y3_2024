import React, { useEffect, useState } from 'react'
import { formatCurrencyVND } from '../../utils/currency';
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Option, Select } from '@material-tailwind/react';
import Cookies from 'js-cookie';

const FoodManageCard = ({ food, getRestaurant, foodCategories }) => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [foodImage, setFoodImage] = useState({})
    const [foodImageURL, setFoodImageURL] = useState(food?.image)
    const [formFood, setFormFood] = useState({
        name: '',
        price: '',
        discount: '',
        description: '',
        category: '',
    })

    useEffect(() => {
        setFormFood({
            name: food?.name,
            price: food?.price,
            discount: food?.discount,
            description: food?.description,
            category: food?.category.id,
        })
    }, [food])

    useEffect(() => {
        console.log(foodCategories);
    }, [])

    const accessToken = Cookies.get('access_token');

    const handleEditFoodConfirm = async () => {
        if (handleValidateFoodForm()) {
            console.log(formFood)

            let form = new FormData()
            form.append('name', formFood.name)
            form.append('price', formFood.price)
            form.append('discount', formFood.discount)
            form.append('image', foodImage)
            form.append('description', formFood.description)
            form.append('category', formFood.category)

            const response = await fetch(BASE_URL + `foods/${food.id}/`, {
                method: 'PATCH',
                body: form
            })

            if (response.status == 200) {
                const data = await response.json()
                if (data) {
                    getRestaurant()
                    setIsOpen(false)
                }
            }
        }
    }

    const handleDeleteFoodConfirm = async () => {
        const response = await fetch(BASE_URL + `foods/${food.id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                is_delete: true,
            })
        })

        if (response.status == 200) {
            const data = await response.json()
            console.log(data)
            if (data) {
                getRestaurant()
                setIsOpenDelete(false)
            }
        }
    }

    const handleValidateFoodForm = () => {
        return true
    }

    const handleInputFoodChange = (e) => {
        const { name, value } = e.target;
        setFormFood({
            ...formFood,
            [name]: value
        });
    };

    const handleGetFoodImage = (e) => {
        let file = e.target.files[0]
        if (file) {
            setFoodImage(e.target.files[0])
            setFoodImageURL(URL.createObjectURL(file))
        }
    }

    const handleOpenFoodDialog = () => {
        setIsOpen(false)
    }

    return (
        <>
            <Dialog open={isOpen} handler={() => setIsOpen(!isOpen)}>
                <DialogHeader>Thông tin món ăn</DialogHeader>
                <DialogBody>

                    <div className="my-4 flex justify-center">
                        <div>
                            <p>
                                Chọn ảnh món ăn
                            </p>
                            <input name="discount" onChange={handleGetFoodImage} type="file" accept="image/*" />
                        </div>
                        <img className='h-40' src={foodImageURL} />
                        {/* {passwordError.id == 2 && <p className="text-red-500 text-sm mx-2">{passwordError.msg}</p>} */}
                    </div>
                    <div className="mb-4">
                        <Input onBlur={handleValidateFoodForm} name="name" onChange={handleInputFoodChange} type="text" label="Tên món ăn" value={formFood?.name} />
                        {/* {passwordError.id == 0 && <p className="text-red-500 text-sm mx-2">{passwordError.msg}</p>} */}
                    </div>
                    <div className="my-4">
                        <Input onBlur={handleValidateFoodForm} name="description" onChange={handleInputFoodChange} type="text" label="Thông tin món ăn" value={formFood?.description} />
                        {/* {passwordError.id == 1 && <p className="text-red-500 text-sm mx-2">{passwordError.msg}</p>} */}
                    </div>
                    <div className="my-4">
                        <Input onBlur={handleValidateFoodForm} name="price" onChange={handleInputFoodChange} type="number" label="Giá món ăn" value={formFood?.price} />
                        {/* {passwordError.id == 2 && <p className="text-red-500 text-sm mx-2">{passwordError.msg}</p>} */}
                    </div>
                    <div className="my-4">
                        <Input onBlur={handleValidateFoodForm} name="discount" onChange={handleInputFoodChange} type="number" label="Giảm giá món ăn" value={formFood?.discount} />
                        {/* {passwordError.id == 2 && <p className="text-red-500 text-sm mx-2">{passwordError.msg}</p>} */}
                    </div>

                    <div className='my-4'>
                        <Select onChange={(val) => handleInputFoodChange({ target: { name: 'category', value: val } })} label="Chọn loại món ăn" value={formFood?.category}>
                            {foodCategories.map(cate => {
                                return <Option value={cate.id}>{cate.name}</Option>
                            })}
                        </Select>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleOpenFoodDialog}
                        className="mr-1"
                    >
                        <span>Huỷ</span>
                    </Button>
                    <Button variant="gradient" color="green" onClick={handleEditFoodConfirm}>
                        <span>Xác nhận</span>
                    </Button>
                </DialogFooter>
            </Dialog >

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
                    <p className='text-sm text-gray-600'>{food?.category.name}</p>
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
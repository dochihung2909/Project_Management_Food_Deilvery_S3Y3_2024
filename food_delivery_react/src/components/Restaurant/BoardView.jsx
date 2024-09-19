import React, { useEffect, useState } from 'react'
import { formatCurrencyVND } from '../../utils/currency'
import FoodManageCard from '../Cards/FoodManageCard'
import EmployeeManageCard from '../Cards/EmployeeManageCard'
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Select, Input, Option } from '@material-tailwind/react'
import Cookies from 'js-cookie'
import OrderCard from '../OrderHistory/OrderCard'

const BoardView = ({ restaurant, selecting, foods = [], getRestaurant }) => {

    const [formFood, setFormFood] = useState({
        name: '',
        price: '',
        discount: '',
        description: '',
        category: '',
    })

    const [foodImage, setFoodImage] = useState({})

    const [foodImageURL, setFoodImageURL] = useState('')

    const [foodCategories, setFoodCategories] = useState([])

    const [openFoodCreate, setOpenFoodCreate] = useState(false)

    const [orders, setOrders] = useState([])

    const BASE_URL = import.meta.env.VITE_BASE_URL

    const accessToken = Cookies.get('access_token')

    const handleGetFoodCategories = async () => {
        const response = await fetch(BASE_URL + `food-categories/`)
        if (response.status == 200) {
            const data = await response.json()

            setFoodCategories(data.results)
        }
    }

    const handleInputFoodChange = (e) => {
        const { name, value } = e.target;
        setFormFood({
            ...formFood,
            [name]: value
        });
    };

    const handleGetPayments = async () => {
        const response = await fetch(BASE_URL + `restaurants/${restaurant.id}/payments/`)

        if (response.status == 200) {
            const data = await response.json()

            setOrders(data)

            // console.log(data)
        }
    }

    const handleGetFoodImage = (e) => {
        let file = e.target.files[0]
        if (file) {
            setFoodImage(e.target.files[0])
            setFoodImageURL(URL.createObjectURL(file))
        }

    }

    useEffect(() => {
        handleGetFoodCategories()
    }, [])

    useEffect(() => {
        handleGetPayments()
    }, [restaurant])

    const handleAddNewFood = async () => {
        if (handleValidateFoodForm()) {
            let form = new FormData()
            form.append('name', formFood.name)
            form.append('price', formFood.price)
            form.append('discount', formFood.discount)
            form.append('image', foodImage)
            form.append('description', formFood.description)
            form.append('category', formFood.category)

            const response = await fetch(BASE_URL + `restaurants/${restaurant.id}/food/`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                body: form
            })

            if (response.status == 201) {
                const data = await response.json()

                if (data) {
                    getRestaurant()
                    setOpenFoodCreate(false)
                }
            }
        }
    }

    const handleValidateFoodForm = () => {
        // console.log(formFood)

        return true
    }

    const handleOpenFoodDialog = () => {
        setOpenFoodCreate(!openFoodCreate)
    }

    const handleConfirmOrder = async (orderId) => {
        const response = await fetch(BASE_URL + `payments/${orderId}/`, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                status: 2
            })
        })

        if (response.status == 200) {
            const data = await response.json()

            if (data) {
                await handleGetPayments()
            }

        }
    }


    return (
        <>
            {selecting == 'Foods' ?
                <div className='my-2'>
                    <Dialog open={openFoodCreate} handler={handleOpenFoodDialog}>
                        <DialogHeader>Đổi mật khẩu</DialogHeader>
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
                                <Input onBlur={handleValidateFoodForm} name="name" onChange={handleInputFoodChange} type="text" label="Tên món ăn" />
                                {/* {passwordError.id == 0 && <p className="text-red-500 text-sm mx-2">{passwordError.msg}</p>} */}
                            </div>
                            <div className="my-4">
                                <Input onBlur={handleValidateFoodForm} name="description" onChange={handleInputFoodChange} type="text" label="Thông tin món ăn" />
                                {/* {passwordError.id == 1 && <p className="text-red-500 text-sm mx-2">{passwordError.msg}</p>} */}
                            </div>
                            <div className="my-4">
                                <Input onBlur={handleValidateFoodForm} name="price" onChange={handleInputFoodChange} type="number" label="Giá món ăn" />
                                {/* {passwordError.id == 2 && <p className="text-red-500 text-sm mx-2">{passwordError.msg}</p>} */}
                            </div>
                            <div className="my-4">
                                <Input onBlur={handleValidateFoodForm} name="discount" onChange={handleInputFoodChange} type="number" label="Giảm giá món ăn" />
                                {/* {passwordError.id == 2 && <p className="text-red-500 text-sm mx-2">{passwordError.msg}</p>} */}
                            </div>

                            <div className='my-4'>
                                <Select onChange={(val) => handleInputFoodChange({ target: { name: 'category', value: val } })} label="Chọn loại món ăn">
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
                            <Button variant="gradient" color="green" onClick={handleAddNewFood}>
                                <span>Xác nhận</span>
                            </Button>
                        </DialogFooter>
                    </Dialog>

                    <Button onClick={handleOpenFoodDialog} className='bg-green-500 my-4'>Thêm món ăn</Button>
                    <div>
                        {foods.map((food, index) => (
                            <FoodManageCard getRestaurant={getRestaurant} food={food} key={index} foodCategories={foodCategories}
                            />
                        ))}
                    </div>
                </div>
                :
                <div className='my-2'>
                    <div>
                        {orders.map((order, index) => (
                            <>
                                <OrderCard key={index} restaurant={order?.restaurant} method={order?.method} status={order?.status} cart={order?.cart}></OrderCard>
                                {(!['Delivering', 'Completed'].includes(order.status)) &&
                                    <div className='flex justify-end'>
                                        <Button onClick={() => handleConfirmOrder(order?.id)} className='bg-primary'>Nhận đơn</Button>
                                    </div>
                                }
                            </>
                        ))}
                    </div>
                </div>
            }
        </>
    )
}

export default BoardView
import React, { useEffect, useState } from 'react';
import FoodCard from '../Cards/FoodCard';
import { IoIosArrowDown } from 'react-icons/io';
import FoodCartCard from '../Cards/FoodCartCard';
import { formatCurrencyVND } from '../../utils/currency';
import { useNavigate } from 'react-router-dom';

const OrderSummary = ({  foods, totalAmount }) => {
    const [showAll, setShowAll] = useState(false)

    const displayedFoods = (showAll ? foods : foods.slice(0, 2)) || []
    const navigate = useNavigate()

    useEffect(() => {
        if (foods.length == 0) {
            navigate('/')
        }
    }, [])


    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-2 text-[#ac4a22]">Tóm tắt đơn hàng</h3>

            {foods.length > 0 ? (
                <>
                    {displayedFoods.map((food, index) => (
                        <FoodCartCard food={food} key={index} />
                    ))}

                    {foods.length > 2 && !showAll && (
                        <div className='flex items-center flex-col'>
                            <p
                                className='text-gray-500 rounded px-1 py-1 hover:bg-gray-100 cursor-pointer'
                                onClick={() => setShowAll(true)}>
                                Xem thêm
                            </p>
                            <IoIosArrowDown />
                        </div>
                    )}

                    {showAll && (
                        <div className='flex items-center flex-col'>
                            <p
                                className='text-gray-500 rounded px-1 py-1 hover:bg-gray-100 cursor-pointer'
                                onClick={() => setShowAll(false)}>
                                Thu gọn
                            </p>
                            <IoIosArrowDown />
                        </div>
                    )}
                </>
            ) : (
                <p className='text-lg'>Giỏ hàng trống</p>
            )}

            <div className='w-full border-t border-gray-200 my-2' />

            <div className="flex justify-between">
                <p>Phí vận chuyển</p>
                <span>15,000đ</span>
            </div>

            <div className='flex justify-between text-primary text-lg font-semibold'>
                <p>Tổng cộng</p>
                <span>{formatCurrencyVND(totalAmount)}</span>
            </div>
            {/* <FoodCard /> */}
        </div>
    );
};

export default OrderSummary;

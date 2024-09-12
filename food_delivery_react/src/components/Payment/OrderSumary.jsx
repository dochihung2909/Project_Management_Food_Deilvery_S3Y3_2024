import React from 'react';
import FoodCard from '../Cards/FoodCard';
import { IoIosArrowDown } from 'react-icons/io';

const OrderSummary = ({ cart }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-2 text-[#ac4a22]">Tóm tắt đơn hàng</h3>

            <div className="flex justify-between mb-2">
                <img className='w-1/4' src="https://res.cloudinary.com/dhitdivyi/image/upload/v1725855054/vedsqysasq8jjwgvjnea.jpg" alt="Món ăn" />
                <p>Sữa tươi chân trâu đường đen</p>
                <span>45,000đ</span>
            </div>

            <div className="flex justify-between mb-2">
                <img className='w-1/4' src="https://res.cloudinary.com/dhitdivyi/image/upload/v1725855054/vedsqysasq8jjwgvjnea.jpg" alt="Món ăn" />
                <p>Trà sữa kem cheese cao full</p>
                <span>39,000đ</span>
            </div>

            <div className='flex items-center flex-col '>
                <p className='text-gray-500 rounded px-1 py-1 hover:bg-gray-100 cursor-pointer'>Xem thêm</p>
                <IoIosArrowDown />
            </div>

            {/* {
                cart.foods.map((food, index) => (
                    <FoodCartCard food={food} key={index} />
                ))
            } */}

            <div className='w-full border-t border-gray-200 my-2' />

            <div className="flex justify-between">
                <p>Phí vận chuyển</p>
                <span>15,000đ</span>
            </div>

            <div className='flex justify-between text-primary text-lg font-semibold'>
                <p>Tổng cộng</p>
                <span>99,000đ</span>
                {/* <span>{cart.amount}</span> */}
            </div>
            {/* <FoodCard /> */}
        </div>
    );
};

export default OrderSummary;

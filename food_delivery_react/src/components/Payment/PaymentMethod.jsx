import React, { useState } from 'react';
import { AiOutlineBank } from 'react-icons/ai';
import { BsCashCoin } from 'react-icons/bs';
import { MdOutlineAccountBalanceWallet } from 'react-icons/md';

const PaymentMethod = () => {
    const [selectedMethod, setSelectedMethod] = useState('');

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-2 text-[#ac4a22]">Phương thức thanh toán</h3>
            <div className='w-full border-t bg-gray-300 my-2' />
            <div className="mb-2 flex items-center">
                <input
                    type="radio"
                    id="cod"
                    name="payment"
                    value="cod"
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="mr-2"
                />
                <BsCashCoin />
                <label className='ml-2' htmlFor="cod">Thanh toán khi nhận hàng</label>
            </div>
            <div className='mb-2 flex items-center'>
                <input
                    type="radio"
                    id="momo"
                    name="payment"
                    value="momo"
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="mr-2"
                />
                <MdOutlineAccountBalanceWallet />
                <label className='ml-2' htmlFor="momo">Momo</label>
            </div>
            <div className='flex items-center'>
                <input
                    type="radio"
                    id="bank"
                    name="payment"
                    value="bank"
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="mr-2"
                />
                <AiOutlineBank />
                <label className='ml-2' htmlFor="bank">Bank</label>
            </div>
        </div>
    );
};

export default PaymentMethod;

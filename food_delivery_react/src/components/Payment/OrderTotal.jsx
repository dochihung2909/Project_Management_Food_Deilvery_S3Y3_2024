import React from 'react';

const OrderTotal = () => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#ac4a22]">Tổng cộng</h3>
                <span className="text-lg font-semibold">99,000đ</span>
            </div>
            <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition">
                Đặt đơn
            </button>
        </div>
    );
};

export default OrderTotal;

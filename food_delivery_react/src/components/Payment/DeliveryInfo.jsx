import React from 'react';

const DeliveryInfo = () => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-2 text-[#ac4a22]">Giao đến</h3>
            <div className='w-full border-t bg-gray-300 my-2' />
            <p className="mb-2">Thời gian vận chuyển</p>
            <p className='text-gray-500'>15 phút (cách 1.5km)</p>
            <div className='w-full border-t bg-gray-300 my-2' />
            <div className=' w-full flex flex-row items-center justify-center'>
                <div className='w-1/3 flex justify-center text-center'>
                    {/* <h1>Ảnh google map</h1> */}
                    <img className='w-4/5 mr-3 my-2' src="https://res.cloudinary.com/dhitdivyi/image/upload/v1726064034/kxtbmxvzszibwm7axo8r.png" alt="Ảnh địa chỉ google map" />
                </div>
                <div className='w-2/3 h-full'>
                    <p className='text-lg'>Địa chỉ</p>
                    <input
                        type="text"
                        className="w-full p-2 mb-2 border rounded-md"
                        value="29 đường hưng thuận 45 phường Tân"
                        disabled
                    />
                    <p className='text-lg mt-2'>Ghi chú</p>
                    <input
                        placeholder="Ghi chú"
                        className="w-full p-2 border rounded-md"
                    ></input>
                </div>
            </div>
        </div>
    );
};

export default DeliveryInfo;

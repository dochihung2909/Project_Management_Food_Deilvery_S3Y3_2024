import { Button } from '@material-tailwind/react'
import React from 'react'

export default function PaymentSuccess() {
  return (
    <div className='flex-col flex items-center mt-10'>
      <h1 className='text-xl text-primary font-semibold'>Đặt hàng thành công</h1>
      <div className='mt-4'>
        <Button className='bg-primary'>
          Trở về trang giỏ hàng
        </Button> 
      </div>
    </div>
  )
}

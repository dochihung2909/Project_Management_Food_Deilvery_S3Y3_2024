import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { useUser } from '../../contexts/UserContext'
import OrderCard from './OrderCard'
import { Button } from '@material-tailwind/react'
import { formatCurrencyVND } from '../../utils/currency'
import { dateFormat } from '../../utils/dateFormat'

export default function OrderHistory() {
    const BASE_URL = import.meta.env.VITE_BASE_URL
    const accessToken = Cookies.get('access_token')
    const { user } = useUser()

    const [payments,setPayments] = useState([])

    const handleGetPayments = async () => {
        const response = await fetch(BASE_URL + 'users/current-user/payments/', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            }
        })
 
        if (response.status == 200) {
            const data = await response.json();
            if (data) {
                setPayments(data)
                console.log(data)
            }
        }
    }

    useEffect(() => {
        handleGetPayments() 
    }, [user])

  return (
    <div className='container mx-auto mt-10'>
        <h1 className='text-4xl font-semibold'>Lịch sử mua hàng</h1>
        <div className=''>
            {payments.map((payment,index) => {
               return (<div className='my-10'>
                        <OrderCard key={index} restaurant={payment?.restaurant} cart={payment?.cart} method={payment.method} status={payment.status}></OrderCard>
                        <div className='flex justify-between mt-2 border-t-2 items-center'>
                            <div>
                                {dateFormat(payment.created_date)}
                            </div>
                            <div className='flex items-center'>
                                <p className='text-xl my-2 mr-2'>
                                    Tổng cộng: 
                                </p>
                                <p className='text-xl text-primary my-2'>
                                    {formatCurrencyVND(payment.cart.total_amount)}
                                </p> 
                            </div>
                        </div>
                        <div className='flex justify-end mt-2'>
                            <Button className='bg-primary'>Đã nhận hàng</Button> 
                        </div>
                    </div>)
              
            })}
        </div> 
    </div>
  )
}

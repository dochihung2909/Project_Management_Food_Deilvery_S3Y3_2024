import React, { useEffect, useState } from 'react'
import DeliveryInfo from './DeliveryInfo'
import OrderSummary from './OrderSumary'
import PaymentMethod from './PaymentMethod'
import OrderTotal from './OrderTotal'
import { useCart } from '../../contexts/CartContext'
import { useNavigate } from 'react-router-dom'


const PaymentPage = () => {
    const { cart } = useCart() 

    const BASE_URL = import.meta.env.VITE_BASE_URL

    const navigate = useNavigate()

    const deliveryCost = 15000
    const [payment,setPayment] = useState({
        method: '0',
        status: '0',
        note: ''
    })

    const handleSubmitPayment = async () => {
        if (cart.id != null) {
            const response = await fetch(BASE_URL + `carts/${cart.id}/payments/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify({
                    status: payment.status,
                    method: payment.method,
                    note: payment.note
                })
            }) 

            const data = await response.json() 
            console.log(data) 
            
            if (response.status == 201) {
                
                setTimeout(() => {
                    navigate('/') 
                }, 1000)
            }
        }
    }

    useEffect(() => {
        console.log(payment)
    }, [payment])

    return (
        <div className='container mx-auto p-4 relative mb-[100px] bg-gray-50 min-h-screen'>
            <DeliveryInfo setPayment={setPayment} />
            <OrderSummary foods={cart.foods} totalAmount={cart.amount} deliveryCost={deliveryCost} />
            <PaymentMethod setPayment={setPayment} method={payment.method} />
            <div className='fixed container bottom-0  '>
                <OrderTotal totalAmount={cart.amount + deliveryCost}>
                    <button onClick={handleSubmitPayment} className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition">
                        Đặt đơn
                    </button>   
                </OrderTotal>
                
            </div>
        </div>
    )
}

export default PaymentPage
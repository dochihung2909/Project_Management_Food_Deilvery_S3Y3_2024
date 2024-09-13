import React, { useEffect } from 'react'
import DeliveryInfo from './DeliveryInfo'
import OrderSummary from './OrderSumary'
import PaymentMethod from './PaymentMethod'
import OrderTotal from './OrderTotal'
import { useCart } from '../../contexts/CartContext'


const PaymentPage = () => {
    const { cart } = useCart()

    useEffect(() => {
        console.log(cart)
    }, [])

    return (
        <div className='w-1/2 mx-auto p-4 bg-gray-50 min-h-screen'>
            <DeliveryInfo />
            <OrderSummary foods={cart.foods} totalAmount={cart.amount} />
            <PaymentMethod />
            <OrderTotal totalAmount={cart.amount} />
        </div>
    )
}

export default PaymentPage
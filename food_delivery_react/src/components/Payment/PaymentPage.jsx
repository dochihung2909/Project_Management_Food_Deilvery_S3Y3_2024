import React from 'react'
import DeliveryInfo from './DeliveryInfo'
import OrderSummary from './OrderSumary'
import PaymentMethod from './PaymentMethod'
import OrderTotal from './OrderTotal'
import { useCart } from '../../contexts/CartContext'


const PaymentPage = () => {
    const { cart } = useCart()
    return (
        <div className='w-1/2 mx-auto p-4 bg-gray-50 min-h-screen'>
            <DeliveryInfo />
            <OrderSummary cart={cart} />
            <PaymentMethod />
            <OrderTotal cart={cart} />
        </div>
    )
}

export default PaymentPage
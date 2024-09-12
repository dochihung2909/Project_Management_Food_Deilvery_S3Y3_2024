import React from 'react'
import DeliveryInfo from './DeliveryInfo'
import OrderSummary from './OrderSumary'
import PaymentMethod from './PaymentMethod'
import OrderTotal from './OrderTotal'

const PaymentPage = ({ cart }) => {
    return (
        <div className='w-1/2 mx-auto p-4 bg-gray-50 min-h-screen'>
            <DeliveryInfo />
            <OrderSummary cart={cart} />
            <PaymentMethod />
            <OrderTotal />
        </div>
    )
}

export default PaymentPage
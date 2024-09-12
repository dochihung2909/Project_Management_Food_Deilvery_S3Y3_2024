import React, { createContext, useState, useEffect, useReducer } from 'react';

import Cookies from 'js-cookie';
import { CartReducer } from '../states/reducers/CartReducer';
import { useUser } from './UserContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => { 
    const [cart, setCart] = useState({
        id: null,
        amount: 0,
        foods: [],
        restaurant: null
    }) 
    const BASE_URL = import.meta.env.VITE_BASE_URL 

    const { user } = useUser()

    const handleGetCartInfo = async (userID, restaurantID) => { 
        console.log(user)
        const res = await fetch(BASE_URL + 'carts/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: userID || user.id,
                restaurant: restaurantID
            })
        })

        if (res.status == 200) {
            const data = await res.json()  
            setCart({
                id: data.id,
                amount: data.total_amount,
                foods: data.cart_details,
                restaurant: data.restaurant
            }) 
        }   
    }

    useEffect(() => { 
        if (user && cart.restaurant) {
            handleGetCartInfo(user.id, cart.restaurant) 
        }
    }, [user])

    useEffect(() => {
        console.log(cart)
    }, [cart])

    const getPosFoodInCart = (food) => {
        for (let i =0;i<cart.foods.length; i++) {
            if (food.id == cart.foods[i].food.id) {
                return i
            }
        }
        return -1
    }

    const calcTotalAmount = () => { 
        let newAmount = 0 
        for (let i =0;i <cart.foods.length;i++) {
            let food = cart.foods[i]
            newAmount += ((food.price - food.discount) * food.quantity) 
        } 
        return newAmount
    } 

    const add = async (food) => {  
        if (food) {
            console.log(food)
            if (food.restaurant != cart.restaurant) { 
                cart.foods = []  
                cart.amount = 0 
            }  
            cart.restaurant = food.restaurant  
            addFoodToCart(cart.id, food)   
        }
    };

    const addFoodToCart = async (cartId, food) => {  
        console.log(cartId, food)
        const response = await fetch(BASE_URL + `carts/${cartId}/cart-details/`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            food: food.id,
            quantity: food.quantity
          })
        })
        
        if (response.status == 201 || response.status == 200) {
            const data = await response.json() 
            console.log(data)
            setCart({...cart,
                id: data.id,
                amount: data.total_amount,
                foods: data.cart_details,
                restaurant: data.restaurant
            }) 
        }
    }
      
    const remove = async (food) => {   
        let foodPos = getPosFoodInCart(food)    
        if (foodPos != -1) {
            // let f = cart.foods[foodPos] 
            // if (f.quantity > 1) { 
            //     newCart[foodPos].quantity -= 1
            // }   
            // else {
            //     newCart.foods.splice(foodPos,1) 
            // }  
            // cart.foods = newCart 
            // cart.amount = calcTotalAmount()
            addFoodToCart(cart.id, food)
        }

        // dispatch({ type: 'remove', payload: cart }); 
    };    

    const payment = async () => { 
        
    }; 

    return (
        <CartContext.Provider value={{ cart, add, remove, setCart, handleGetCartInfo }}>
            {children}
        </CartContext.Provider>
    );
}; 

export const useCart = () => React.useContext(CartContext);
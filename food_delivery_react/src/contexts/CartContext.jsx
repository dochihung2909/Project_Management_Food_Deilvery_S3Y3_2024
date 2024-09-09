import React, { createContext, useState, useEffect, useReducer } from 'react';

import Cookies from 'js-cookie';
import { CartReducer } from '../states/reducers/CartReducer';

export const CartContext = createContext();

export const CartProvider = ({ children }) => { 
    const [cart, setCart] = useState({
        amount: 0,
        foods: [],
        restaurant: null,
    })

    const getPosFoodInCart = (food) => {
        for (let i =0;i<cart.foods.length; i++) {
            if (food.id == cart.foods[i].id) {
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
        if (food.restaurant != cart.restaurant) { 
            cart.foods = []  
            cart.amount = 0
            setCart(cart)
        }
        cart.restaurant = food.restaurant 
        let newCart = [...cart.foods] 
        let foodPos = getPosFoodInCart(food)
        if (foodPos == -1) {
            newCart.push(food)
        } else {
            newCart[foodPos].quantity += 1
        }
        cart.foods = newCart
        cart.amount = calcTotalAmount()   
        setCart(cart)  
    };
      
    const remove = async (food) => {
        let newCart = [...cart.foods]
        let foodPos = getPosFoodInCart(food)   
        if (foodPos != -1) {
            let f = cart.foods[foodPos] 
            if (f.quantity > 1) { 
                newCart[foodPos].quantity -= 1
            }   
            else {
                newCart.foods.splice(foodPos,1) 
            }  
            cart.foods = newCart 
            cart.amount = calcTotalAmount()
            setCart(cart) 
        }

        // dispatch({ type: 'remove', payload: cart }); 
    };   

    const getFoodQuantity = (food) => {
        let foodPos = getPosFoodInCart(food) 
        if (foodPos != -1) {
            return cart.foods[foodPos].quantity  
        }
        return 0 
    }

    const payment = async () => { 
        
    }; 

    return (
        <CartContext.Provider value={{ cart, add, remove, getFoodQuantity }}>
            {children}
        </CartContext.Provider>
    );
}; 

export const useCart = () => React.useContext(CartContext);
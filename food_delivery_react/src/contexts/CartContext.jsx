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

        if (res.status == 200 || res.status == 201) {
            const data = await res.json()  
            console.log(data)
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
        console.log(food)
        if (food) {
            console.log(food, cart)
            if (cart.id != null) {
                if (food.restaurant != cart.restaurant) { 
                    await handleGetCartInfo(user.id, food.restaurant) 
                }    
            } else {
                await handleGetCartInfo(user.id, food.restaurant) 
            }
            await addFoodToCart(cart.id, food)   
        }
    };

    const addFoodToCart = async (cartId, food, isDelete = false) => {  
        console.log(cartId, food)
        const response = await fetch(BASE_URL + `carts/${cartId}/cart-details/`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            food: food.id,
            quantity: food.quantity,
            is_delete: isDelete
          })
        })
        
        if (response.status == 200 || response.status == 201) { 
            const data = await response.json() 
            console.log(data)
            if (response.status == 201) {
                let newFoods = cart.foods
                newFoods.push(data)
                setCart({...cart, amount: cart.amount + data.amount, foods: newFoods}) 
            } else { 
                setCart({...cart,
                    id: data.id,
                    amount: data.total_amount,
                    foods: data.cart_details,
                    restaurant: data.restaurant
                })  
            }
        } 
    }
      
    const remove = async (food) => {   
        let foodPos = getPosFoodInCart(food)    
        if (foodPos != -1) { 
            await addFoodToCart(cart.id, food, true)
        } 
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
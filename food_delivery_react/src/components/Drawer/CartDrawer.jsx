import React, { useEffect, useState } from "react";
import {
  Drawer,
  Button,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { useCart } from "../../contexts/CartContext";
import { formatCurrencyVND } from "../../utils/currency";
import FoodCartCard from "../Cards/FoodCartCard";
 
export function CartDrawer({open, setOpen}) {  
  
  const closeDrawer = () => setOpen(false);

  const { cart } = useCart()

  const [cartAmount, setCartAmount] = useState(cart.amount)   

  useEffect(() => {
    setCartAmount(cart.amount)
  }, [cart.amount])
 
 
  return (
    <React.Fragment> 
      <Drawer 
        size={500} placement="right" open={open} onClose={closeDrawer} className="p-4">
        <div className="mb-6 flex items-center justify-between">
          <Typography className="text-2xl" variant="h5" color="blue-gray">
            Giỏ đồ ăn
          </Typography>
          <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>
        <Typography color="gray" className="mb-8 pr-4 font-normal">
          {cart.foods.map((food,index) => {
            return (
                <FoodCartCard setCart={setCartAmount} key={index} food={food}></FoodCartCard>
            )
          })}
        </Typography>
        <div className="absolute bottom-0 left-0 w-full">
            <div className="p-4 w-full"> 
                <div className="text-xl mb-4 flex justify-between">
                    <h1>Tổng cộng</h1>
                    <h1>{formatCurrencyVND(cartAmount)}</h1>
                </div> 
                <Button className="w-full bg-primary">Thanh toán</Button> 
            </div>
        </div>
      </Drawer>
    </React.Fragment>
  );
}
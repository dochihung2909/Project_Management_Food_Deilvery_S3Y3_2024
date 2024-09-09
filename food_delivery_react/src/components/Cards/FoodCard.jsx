import React from 'react'
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
  } from "@material-tailwind/react";
  import { useNavigate } from 'react-router-dom';

export default function FoodCard({food}) { 
    const navigate = useNavigate();
    return (
        <Card onClick={() => navigate(`food/${food.id}/`)} className="mt-6 w-full cursor-pointer">
          <CardHeader color="blue-gray" className="relative h-70">
            <img
              src={food?.avatar}
              alt="card-image"
            />
          </CardHeader>
          <CardBody>
            <Typography variant="h5" color="blue-gray" className="mb-2">
              {food?.name}
            </Typography>
            <p className='line-clamp-1'>
              {food.category}
            </p>
          </CardBody>
          <CardFooter className="pt-0">
            <div className='grid grid-cols-3 gap-2 text-center'>
                <p><i className="text-yellow-500 fa-solid fa-star"></i> {food.rating} </p>
                <p><i className="fa-regular fa-clock"></i> {food.time} </p>
                <p><i class="fa-solid fa-location-dot"></i> {food.distance} </p> 
            </div>
          </CardFooter>
        </Card>
      );
}

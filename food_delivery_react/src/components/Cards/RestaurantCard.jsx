import { Card, CardBody, CardFooter, CardHeader, Typography } from '@material-tailwind/react';
import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function RestaurantCard({restaurant}) {
    const navigate = useNavigate();

    const handleNavigateRestaurant = () => {
        navigate(`restaurant/${restaurant.id}/`, {state: {
            restaurant: restaurant,
        }})
    }

    return (
        <Card onClick={handleNavigateRestaurant} className="mt-6 w-full cursor-pointer">
          <CardHeader color="blue-gray" className="relative h-40">
            <img
                className='object-cover w-full h-full'
              src='https://food-cms.grab.com/compressed_webp/merchants/5-C4CEPAAEL4CJJA/hero/782d2085-530e-48fa-9fa2-f392d8f54a4f__store_cover__2023__08__01__06__31__39.webp'
              alt="card-image"
            />
          </CardHeader>
          <CardBody className='p-4'>
            <Typography variant="h5" color="blue-gray" className="mb-2">
              {restaurant?.name}
            </Typography>
            <p className='line-clamp-1'>
              {restaurant.category}
            </p>
          </CardBody>
          <CardFooter className="p-2 pt-0 mt-auto">
            <div className='grid grid-cols-3 gap-2'>
                <p className='text-center'><i className="text-yellow-500 fa-solid fa-star"></i> {restaurant.rating} </p>
                <p className='col-span-2 line-clamp-1'>{restaurant.address}</p>
                {restaurant?.time && <p><i className="fa-regular fa-clock"></i> {restaurant.time} </p>}
                {restaurant?.distance && <p><i class="fa-solid fa-location-dot"></i> {restaurant?.distance} </p> }
            </div>
          </CardFooter>
        </Card>
      );
}

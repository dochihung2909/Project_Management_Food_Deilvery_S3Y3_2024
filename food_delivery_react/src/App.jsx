import { useEffect, useLayoutEffect, useState } from 'react'
import './App.css'
import Header from './components/Header/Header'
import FoodCard from './components/Cards/FoodCard'
import RestaurantCard from './components/Cards/RestaurantCard'

function App() {

  const [nextFoodPage, setFoodNextPage] = useState(1)
  const [nextRestaurantPage, setRestaurantNextPage] = useState('')
  const [foods, setFoods] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const BASE_URL = import.meta.env.VITE_BASE_URL
  const [hasMore, setHasMore] = useState(true);

  const getFoods = async () => {    
    const response = await fetch(`${BASE_URL}/foods/?page=${nextFoodPage}`) 
    if (response.status == 200) {
      const data = await response.json() 
      if (data) {   
        setFoods((prevFoods) => {
          let newFoods = [...prevFoods, ...data.results] 
          return nextFoodPage != 1 ? newFoods : data.results
        }) 
        if (!data.next) {
          setHasMore(false);
        } 
      }
    }  
  }  

  const getRestaurants = async () => {
    do {
      const response = await fetch(nextRestaurantPage || BASE_URL + 'restaurants/', {
        method: 'GET',
      })
  
      if (response.status == 200) {
        const data = await response.json()
        if (data) {
          console.log('restaurant', data) 
          if (data.next) {
            setRestaurantNextPage(data.next) 
          } else {  
            setRestaurantNextPage('')
          }  
          setRestaurants([...restaurants, ...data.results])
        }
      } 
    } while (nextRestaurantPage != '')

    
  } 

  useEffect(() => { 
    getRestaurants()  
  }, []) 

  useEffect(() => {
    getFoods();
  }, [nextFoodPage]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50 && hasMore) {
        setFoodNextPage((prevPage) => prevPage + 1);
      }
    };

    // Thêm sự kiện scroll
    window.addEventListener('scroll', handleScroll);

    // Dọn dẹp sự kiện khi component bị unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore]);

  return (
    <>
      <div className='container py-12 w-screen mx-auto'>
        <h1 className='text-4xl font-semibold mb-4'>Ưu đãi ở</h1>
        <div className='grid grid-cols-4 gap-y-8 gap-x-4'>
          {restaurants.map((restaurant, index) => {
            return (
              <RestaurantCard key={index} restaurant={restaurant}></RestaurantCard>
            )
          })}
        </div> 
      </div>

      <div className='container py-12 w-screen mx-auto'>
        <h1 className='text-4xl font-semibold mb-4'>Ưu đãi ở</h1>
        <div className='grid grid-cols-3 gap-y-8 gap-x-4'>
          {foods.map((food, index) => {
            return (
              <FoodCard key={index} food={food}></FoodCard>
            )
          })}
        </div> 
      </div>
    </>
  )

}

export default App

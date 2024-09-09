import { useEffect, useLayoutEffect, useState } from 'react' 
import './App.css'
import Header from './components/Header/Header'
import FoodCard from './components/Cards/FoodCard'
import RestaurantCard from './components/Cards/RestaurantCard'

function App() { 

  const [nextFoodPage, setFoodNextPage] = useState('')
  const [nextRestaurantPage, setRestaurantNextPage] = useState('')
  const [foods, setFoods] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const BASE_URL = import.meta.env.VITE_BASE_URL 

  const getFood = async () => {

    await fetch(BASE_URL + '/foods/', {
      method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
      if (data.next) {
        setFoodNextPage(data.next)
      }
      setFoods(data.results)

    })    
  }  

  const getRestaurants = async () => {
    
    await fetch(BASE_URL + '/restaurants/', {
      method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
      if (data.next) {
        setRestaurantNextPage(data.next)
      }
      console.log(data.results)
      setRestaurants(data.results)
    })

  }


  useLayoutEffect(() => {
    getFood()
    getRestaurants()
  }, []) 
 
  return (
    <> 
      <div className='container py-12 w-screen mx-auto'>
        <h1 className='text-4xl font-semibold mb-4'>Ưu đãi ở</h1>
        <div className='grid grid-cols-4 gap-y-8 gap-x-4'>
          {restaurants.map(restaurant => {
            return ( 
              <RestaurantCard restaurant={restaurant}></RestaurantCard>
            )
          }) } 
        </div>

      </div>
    </>
  )

} 

export default App

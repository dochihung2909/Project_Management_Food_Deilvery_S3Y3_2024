import { useState } from 'react' 
import './App.css'
import Header from './components/Header/Header'
import FoodCard from './components/Cards/FoodCard'

function App() {
  
  let food = {
    id: 1,
    avatar: 'https://food-cms.grab.com/compressed_webp/merchants/5-C6VDCLCBEVMKDE/hero/9af39c09430a428880f16795b2b0fe73_1724322723253884922.webp',
    name: 'Cơm Thố Delichi - Nguyễn Thái Học',
    category: 'Cơm',
    rating: 4.5,
    time: '25 phút',
    distance: '1,2 km'
  }

  return (
    <>
      <Header></Header> 
      <div className='container py-12 w-screen mx-auto'>
        <h1 className='text-4xl font-semibold mb-4'>Ưu đãi ở</h1>
        <div className='grid grid-cols-4 gap-y-8 gap-x-4'>
          <FoodCard food={food}></FoodCard> 
          <FoodCard food={food}></FoodCard> 
          <FoodCard food={food}></FoodCard> 
          <FoodCard food={food}></FoodCard> 
          <FoodCard food={food}></FoodCard> 
          <FoodCard food={food}></FoodCard> 
        </div>

      </div>
    </>
  )
}

export default App

import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {

  const navigate = useNavigate() ; 

  return (
    <div>
      <div className='flex flex-col items-center gap-6 py-20'>
        <h1 className='text-3xl font-bold'>
          Welcome to FoodieHub 🍽️
        </h1>
        <p className='text-gray-600'>
          Choose how you want to continue 
        </p>
        <div className='flex gap-4'>
          <button
            onClick={() => navigate("/user/login")}
            className='px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer'
          >
            I am a Customer 
          </button>

          <button 
            onClick={() => navigate("/food-partner/login")}
            className='px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer'
          >  
            I am a Food Partner 
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home

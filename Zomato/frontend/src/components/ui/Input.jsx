import React from 'react'

const Input = ({label, ...props}) => {
  return (
    <div className='flex flex-col space-y-1 w-full'>
      <label className='text-sm font-medium text-gray-700'>
        {label}
      </label>
      <input
        className='w-full p-3 rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400'
        {
            ...props
        }
      />
    </div>
  )
}

export default Input

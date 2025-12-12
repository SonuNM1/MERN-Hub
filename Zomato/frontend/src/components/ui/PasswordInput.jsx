import React, { useState } from 'react'
import {Eye, EyeOff} from 'lucide-react' ;

const PasswordInput = ({label, ...props}) => {

    // local state to toggle visibility 

    const [visible, setVisible] = useState(false) ; 

    // toggle handler (keep icon accessible)

    const toggle = () => setVisible(
        (v) => !v
    )

  return (
    <div className='flex flex-col space-y-1 w-full'>
      
    {/* label above input */}

    {
        label && <label className='text-sm font-medium text-gray-700'>
            {label}
        </label>
    }

    {/* Wrapper to position input + icon inline */}

    <div className='relative w-full'>
        <input
            {...props}
            type={visible ? "text" : "password"}
            className='w-full p-3 pr-12 rounded-lg border border-gray-300 bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition'
        />
        
        {/* Eye icon button positioned inside input on the right */}

        <button
            type='button'
            onClick={toggle}
            aria-label={visible ? "Hide password": "Show password"}
            className='absolute inset-y-0 right-2 flex items-center px-2 text-gray-600 hover:text-gray-900 transition'
        >
            {
                visible ? <EyeOff size={20} /> : <Eye size={20} />
            }
        </button>

    </div>

    </div>
  )
}

export default PasswordInput

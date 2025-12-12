import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'
import axiosClient from '../../utils/axiosClient';
import ENDPOINTS from '../../utils/endpoints';
import FoodBackground from '../../components/ui/FoodBackground';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';


const UserLogin = () => {

  const navigate = useNavigate() ; 

  const [form, setForm] = useState({
    email: "", 
    password: ""
  })

  // loading state while API call is in progress

  const [loading, setLoading] = useState(false) ; 

  // rememberMe state - if true, we save email in localStorage 

  const [rememberMe, setRememberMe] = useState(false) ; 

  // on mount, try to prefill email from localStorage if previously saved

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail") ;

    if(savedEmail){
      setForm(
        (f) => ({
          ...f, 
          email: savedEmail
        })
      ) ; 
      setRememberMe(true) ; 
    }
  }, [])

  // generic input change handler 

  const handleChange = (e) => {
    setForm({
      ...form, 
      [e.target.name]: e.target.value 
    })
  }

  // simple client-side validation 

  const validate = () => {
    if(!form.email || !form.email.includes("@")) return "Please enter a valid email." ; 

    if(!form.password || form.password.length < 4) return "Password must be at least 4 characters long." ;

    return null ; 
  }

  // login submit handler 

  const handleSubmit = async (e) => {
    e.preventDefault() ; 

    const err = validate() ; 

    if(err) return toast.error(err) ;
    
    try {
      setLoading(true) ; 

      const res = await axiosClient.post(ENDPOINTS.USER_LOGIN, {
        email: form.email, 
        password: form.password
      }) ;

      toast.success(res?.data?.message || "Login successful") ;

      // Remember Me logic: save or remove only the email (never store the password)

      if(rememberMe){
        localStorage.setItem("rememberedEmail", form.email) ;
      }
      else{
        localStorage.removeItem("rememberedEmail") ;
      }

      // redirect to user home 

      setTimeout(() => {
        navigate("/") ;
      }, 700);

    } catch (error) {
      console.log("Login error:", error.response?.data || error.message || error) ; 

      toast.error(error.response?.data?.message || "Login failed")
    }
    finally{
      setLoading(false)
    }

  }

  return (
    <FoodBackground>
      
      {/* Center container: ensures the card sits vertically & horizontally centered */}

      <div className='flex items-center justify-center min-h-screen p-4'>

        {/* Card */}

        <form
          onSubmit={handleSubmit}
          className='w-full max-w-md bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-4'
        >

          {/* Header */}

          <div className='text-center'>
            <h1 className='text-2xl font-semibold text-gray-800'>
              Welcome back 
            </h1>
            <p className='text-sm text-gray-500 mt-1'>
              Sign in to continue
            </p>
          </div>

          {/* Email */}

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
          />

          {/* Password (reusable PasswordInput) */}

          <PasswordInput
            label="Password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
          />

          {/* Row: remember me + forgot password link */}

          <div className='flex items-center justify-between'>
            <label className='flex items-center gap-2 text-sm'>
              <input
                type='checkbox'
                id='rememberMe'
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
              />
              <label 
              htmlFor='rememberMe'
              className='text-sm text-gray-600'>
                Remember me 
              </label>
            </label>

            {/* You can implement forgot password separately */}

            <button
              type='button'
              onClick={() => toast(
                "Feature coming soon!",
                {
                  icon: "⏳"
                }
              )}
              className='text-sm text-shadow-indigo-600 hover:underline cursor-pointer'
            >
              Forgot Password? 
            </button>
          </div>

          {/* Submit button */}

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
          >
            {
              loading? "Signing in..." : "Sign in"
            }
          </button>

          {/* Bottom text with register link (inline) */}

          <p className='text-center text-gray-500 text-sm'>
            Don't have an account? {""}
            <span
              onClick={() => navigate("/user/register")}
              className='text-indigo-600 cursor-pointer hover:underline'
            >
              Register 
            </span>
          </p>

        </form>

      </div>

    </FoodBackground>
  )
}

export default UserLogin

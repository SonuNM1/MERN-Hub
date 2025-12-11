import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div>
      <h1>Page Not Found</h1>
      <p>The page you are looking for doesn't exist.</p>

      <Link to="/"
        style={{
            color: "blue",
            textDecoration: "underline"
        }}
      >
        Back To Home 
      </Link>
    </div>
  )
}

export default NotFound

import { Route, Routes } from "react-router-dom"
import { useState } from "react"
import Register from "./views/Register"
import Login from "./views/Login"
import Feed from "./views/Feed"
import Profile from "./views/Profile"
import postContext from "./context/postContext"
import './App.css'

function App() {
  const [userPosts, setUserPosts] = useState([])
  // const [sharedPosts, setSharedPosts] = useState([])

  return (
    <postContext.Provider value={{ userPosts, setUserPosts }}>
    <Routes>
      <Route path="/" element={<Register />} default />

      <Route path="/login" element={<Login />} />
      
      <Route path="/feed" element={<Feed
        // sharedPosts={sharedPosts} setSharedPosts={setSharedPosts}
      />} />

      <Route path="/user/:userId" element={<Profile
          // sharedPosts={sharedPosts} setSharedPosts={setSharedPosts}
      />} />
    </Routes>
    </postContext.Provider>
  )
}

export default App

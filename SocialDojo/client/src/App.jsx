import { Route, Routes } from "react-router-dom"
import Register from "./views/Register"
import Login from "./views/Login"
import Feed from "./views/Feed"
import Profile from "./views/Profile"
import AddFriends from "./views/AddFriends"
import { useState } from "react"
import './App.css'

function App() {
  const [userPosts, setUserPosts] = useState([])
  // const [sharedPosts, setSharedPosts] = useState([])

  return (
    <Routes>
      <Route path="/" element={<Register />} default />

      <Route path="/login" element={<Login />} />
      
      <Route path="/feed" element={<Feed userPosts={userPosts} setUserPosts={setUserPosts}
        // sharedPosts={sharedPosts} setSharedPosts={setSharedPosts}
      />} />

      <Route path="/user/:userId" element={<Profile userPosts={userPosts} setUserPosts={setUserPosts}
          // sharedPosts={sharedPosts} setSharedPosts={setSharedPosts}
      />} />

      <Route path="/user/:userId/find" element={<AddFriends />} />
    </Routes>
  )
}

export default App
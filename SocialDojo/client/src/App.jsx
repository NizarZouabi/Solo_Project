import { Route, Routes } from "react-router-dom"
import Register from "./views/Register"
import Login from "./views/Login"
import Feed from "./views/Feed"
import Profile from "./views/Profile"
import AddFriends from "./views/AddFriends"
import Conversation from "./views/Conversation"
import io from "socket.io-client"
import { useState, useEffect } from "react"
import './App.css'

function App() {
  const [socket] = useState(() => io(":5000"))
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [userPosts, setUserPosts] = useState([])
  const [allPosts, setAllPosts] = useState([])

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected")
      setIsConnected(true)
    })
    socket.on("disconnect", () => {
      console.log("disconnected")
      setIsConnected(false)
    })
  }, [socket])

  return (
    <Routes>
      <Route path="/" element={<Register />} default />

      <Route path="/login" element={<Login />} />
      
      <Route path="/posts/user/:userId/feed" element={<Feed userPosts={userPosts} setUserPosts={setUserPosts} 
      />} />

      <Route path="/user/:userId" element={<Profile userPosts={userPosts} setUserPosts={setUserPosts}
      />} />

      <Route path="/user/:userId/find" element={<AddFriends />} />

      <Route path="/user/:userId/conversation/:friendId/messages/show" element={<Conversation socket={socket} />} />
    </Routes>
  )
}

export default App
import { Route, Routes } from "react-router-dom"
import Register from "./views/Register"
import Login from "./views/Login"
import Feed from "./views/Feed"
import Profile from "./views/Profile"
import './App.css'

function App() {
  // const [sharedPosts, setSharedPosts] = useState([])

  return (
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
  )
}

export default App

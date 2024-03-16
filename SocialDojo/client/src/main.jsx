import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/userContext'
// import { PostProvider } from './context/postContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <UserProvider>
      {/* <PostProvider> */}
        <App />
      {/* </PostProvider> */}
    </UserProvider>
  </BrowserRouter>,
)
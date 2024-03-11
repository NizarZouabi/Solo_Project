import { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/userContext';
import axios from 'axios'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { setLoggedInUser } = useContext(UserContext)
    const [loginErrors, setLoginErrors] = useState({})
    const Nav = useNavigate()


    const loginHandler = (e) => {
        e.preventDefault()
        axios.post('http://localhost:5000/login', {
            email,
            password
        }, { withCredentials: true })
            .then(res => {
                window.localStorage.setItem('userToken', res.data.token)
                window.localStorage.setItem('userId', res.data.user.userId)
                console.log(res.data)
                setEmail('')
                setPassword('')
                setLoggedInUser(res.data.user);
                Nav('/feed')
            })
            .catch((err) => {
                console.log(err)
                setLoginErrors(err.response.data)
        })
    }


    return (
        <div>
            <div className="bg-gray-50 dark:bg-violet-950">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                            <img className="w-12 h-12 mr-2 rounded-full" src="https://img.freepik.com/premium-vector/mma-fighter-star-mascot-with-belt_152558-78648.jpg" alt="logo"/>
                                SocialDojo
                        </a>
              <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Login
                   </h1>
               <form className="space-y-4 md:space-y-6" onSubmit={loginHandler}>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                    <input className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" name='email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                        {loginErrors.error ? <p className=' text-red-500'>{loginErrors.error.email}</p> : null}
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                    <input className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" name='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        {loginErrors.error ? <p className=' text-red-500'>{loginErrors.error.password}</p> : null}
                </div>
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        New here? <a href="/" className="font-medium text-primary-600 hover:underline dark:text-blue-500">Create an account</a>
                    </p>
                    <button type="submit" className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Connect</button>
                </form>
                </div>
                </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
import { useState, useContext } from 'react';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Register = () => {
    const { setLoggedInUser } = useContext(UserContext)
    const Nav = useNavigate()
    const [userForm, setUserForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        birthdate: '',
        gender: '',
        password: '',
        confirmPassword: '',
    })
    const [passwordMatchError, setPasswordMatchError] = useState('')
    const [registerErrors, setRegisterErrors] = useState({})

    const submitHandler = (e) => {
        e.preventDefault()
        if (userForm.password !== userForm.confirmPassword) {
            return setPasswordMatchError('Passwords do not match.')
        }
        setPasswordMatchError('')

        axios.post('http://localhost:5000/register', {
            firstName: userForm.firstName,
            lastName: userForm.lastName,
            email: userForm.email,
            birthdate: userForm.birthdate,
            gender: userForm.gender,
            password: userForm.password,
            confirmPassword: userForm.confirmPassword
        }, { withCredentials: true })
            .then(res => {
        axios.post('http://localhost:5000/login', {
            email: userForm.email,
            password: userForm.password
        }, { withCredentials: true })
                window.localStorage.setItem('userToken', res.data.token)
                window.localStorage.setItem('userId', res.data.userId)
                setUserForm({
                    firstName: '',
                    lastName: '',
                    email: '',
                    birthdate: '',
                    gender: '',
                    password: '',
                    confirmPassword: ''
                })
                setRegisterErrors({})
                setLoggedInUser(res.data.user)
                Nav('/feed')
            })
            .catch((err) => {
                console.log(err)
                setRegisterErrors(err.response.data.errors)
            })
    };


    return (
        <div>
                <div className="bg-gray-50 dark:bg-violet-950">
                    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                        <p className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                            <img className="w-12 h-12 mr-2 rounded-full" src="https://img.freepik.com/premium-vector/mma-fighter-star-mascot-with-belt_152558-78648.jpg" alt="logo"/>
                                SocialDojo
                        </p>
                        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                <h1 className=" text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    Create a new Account
                                </h1>
                                <form onSubmit={submitHandler} className="space-y-4 md:space-y-6">
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                                        <input className='bg-gray-50 border border-gray-300 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' type='text' name='firstName' value={userForm.firstName} onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })} />
                                            {registerErrors.firstName ? <p className='text-red-500'>{registerErrors.firstName.message}</p> : null}
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                                        <input className='bg-gray-50 border border-gray-300 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' type='text' name='lastName' value={userForm.lastName} onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })} />
                                            {registerErrors.lastName ? <p className='text-red-500'>{registerErrors.lastName.message}</p> : null}
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                        <input type='email' name='email' placeholder="name@example.com" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} className="bg-gray-50 border border-gray-300 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                                            {registerErrors.email ? <p className='text-red-500'>{registerErrors.email.message}</p> : null}
                                            {Object.keys(registerErrors).length > 0 && (
                                            <div className="error-container">
                                              {Object.entries(registerErrors).map(([field, message]) => (
                                                <p key={field} className="text-red-500">
                                                  {field === 'email' && message === 'User already registered.' && (
                                                    <p>Email already in use. Please try a different email address.</p>
                                                  )}
                                                </p>
                                              ))}
                                            </div>)}
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                        <input type='password' name='password' placeholder="••••••••" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} className="bg-gray-50 border border-gray-300 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                                            {registerErrors.password ? <p className='text-red-500'>{registerErrors.password.message}</p> : null}
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                                        <input type='password' placeholder="••••••••" name='confirmPassword' value={userForm.confirmPassword} onChange={(e) => setUserForm({ ...userForm, confirmPassword: e.target.value })} className="bg-gray-50 border border-gray-300 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                                            {passwordMatchError && (<p className='text-red-500'>{passwordMatchError}</p>)}
                                    </div>
                                    <div>
                                         <label className="me-1 text-sm font-medium text-gray-900 dark:text-white" >Birthdate:</label>
                                         <input className="text-center mx-16 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 py-2.5 px-8 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="date" name="birthdate" value={userForm.birthdate} onChange={(e) => setUserForm({ ...userForm, birthdate: e.target.value })} />
                                            {registerErrors.birthdate ? <p className='ms-20 ps-16 text-red-500'>{registerErrors.birthdate.message}</p> : null}
                                    </div>
                                    <div className="flex gap-10">
                                       <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Gender:</label>
                                         <div className="flex gap-5">
                                         <input className='mb-2' type="radio" id="male" name="gender" value="male" onChange={(e) => setUserForm({ ...userForm, gender: e.target.value })} />
                                         <label className="me-1 text-sm font-medium text-gray-900 dark:text-white" >Male</label>
                                         <input className='mb-2' type="radio" id="female" name="gender" value="female" onChange={(e) => setUserForm({ ...userForm, gender: e.target.value })} />
                                         <label className="me-1 text-sm font-medium text-gray-900 dark:text-white" >Female</label>
                                         </div>
                                   </div>
                                         {registerErrors.gender ? <p className=' text-red-500'>{registerErrors.gender.message}</p> : null}
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                 Already have an account? <a href="/login" className="font-medium text-primary-600 hover:underline dark:text-blue-500">Login here</a>
                                </p>
                                    <button className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create an account</button>
                                </form>
                            </div>
                        </div>
                    </div>
               </div>
            </div>
    );
}

export default Register;
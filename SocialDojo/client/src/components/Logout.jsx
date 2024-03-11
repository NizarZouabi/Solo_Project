import {useContext} from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';

const Logout = () => {
    const Nav = useNavigate()
    const { setLoggedInUser } = useContext(UserContext)
    const logmeout = () => {
        axios.post('http://localhost:5000/logout', {}, { withCredentials: true })
            .then(res => {
                window.localStorage.removeItem('userToken');
                window.localStorage.removeItem('userId');
                setLoggedInUser(null);
                console.log(res)
                Nav('/login')
            })
            .catch((err) => console.log(err))
    };

    return (
        <div>
            <button className='shadow-md bg-gray-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full' onClick={() => logmeout()}>Logout</button>
        </div>
    );
}

export default Logout;
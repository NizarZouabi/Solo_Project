// import { useContext} from 'react';
// import { UserContext } from '../context/userContext';
import Logout from '../components/Logout';
import FriendsList from '../components/FriendsList';
import PostModal from '../components/PostModal';
import { UserContext } from '../context/userContext';
import { Link } from 'react-router-dom';
import { useContext } from 'react';

const Feed = () => {
    // const { sharedPosts, setSharedPosts } = props
    const { loggedInUser } = useContext(UserContext)

    return (
        <div className="">
            <div className='container-2xl w-full shadow-lg pt-5 border-solid border-black border-b pb-3 px-20 bg-gray-300 display: flex flex-row justify-end gap-2'>
                <Link to={`/user/${loggedInUser._id}`} className='bg-gray-500 shadow-md hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full'>Profile</Link>
                <Logout />
            </div>
            <div>
                <PostModal />
            </div>
            <div>
                <FriendsList />
            </div>
        </div>
    );
}

export default Feed;

// import { useContext} from 'react';
// import { UserContext } from '../context/userContext';
import Logout from '../components/Logout';
import FriendsList from '../components/FriendsList';
import PostModal from '../components/PostModal';

const Feed = () => {
    // const {loggedInUser} = useContext(UserContext)
    return (
        <div className="bg-gray-50">
            <div className='shadow-lg pt-5 border-solid border-black border-b pb-3 px-20 bg-gray-300' style={{ position: 'absolute', right: '0.5px', display: 'flex', gap: '1270px' }}>
                <a className='bg-gray-500 shadow-md hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full' href="/profile">Profile</a>
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

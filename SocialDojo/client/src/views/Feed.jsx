// import { useContext} from 'react';
// import { UserContext } from '../context/userContext';
import Logout from '../components/Logout';
import FriendsList from '../components/FriendsList';
import PostModal from '../components/PostModal';
import { UserContext } from '../context/userContext';
import { Link } from 'react-router-dom';
import { useContext} from 'react';
import { PostContext } from '../context/postContext';
import Post from '../components/Post';

const Feed = () => {
    // const { sharedPosts, setSharedPosts } = props
    const { userPosts, loading } = useContext(PostContext);
    const { loggedInUser } = useContext(UserContext);
    const sortedPosts = userPosts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    // const [loading, setLoading] = useState(false);

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="">
            <div className='container-2xl w-full shadow-lg pt-5 border-solid border-black border-b pb-3 px-20 bg-gray-300 display: flex flex-row justify-end gap-2'>
                <Link to={`/user/${loggedInUser._id}`} className='bg-gray-500 shadow-md hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full'>Profile</Link>
                <Logout />
            </div>
            <div style={{ position: 'absolute', top: '-14%' }}>
                <PostModal />
            </div>
            <div>
                <FriendsList />
            </div>
            <div>
                {sortedPosts && sortedPosts.length > 0 ? (sortedPosts.map((post, idx) => (<Post key={idx} post={post} user={loggedInUser} profilePic={loggedInUser.profilePic} />))) : (
                <div>
                     <p className='text-center' style={{ position: "absolute", top: "50%", left: "50%"}}>You dont have any posts yet.</p>
                </div>
            )}
            </div>
        </div>
    );
}

export default Feed;

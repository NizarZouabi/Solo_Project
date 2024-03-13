// import { useContext, useState } from 'react';
// import { UserContext } from '../context/userContext';
import Model from 'react-modal';
import Logout from '../components/Logout';
import PostModal from '../components/PostModal';
import FriendsList from '../components/FriendsList';
import postContext from '../context/postContext';
import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/userContext';
import Post from '../components/Post';
// import { useParams } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    // const {id} = useParams()
    const [visiblePfp, setVisiblePfp] = useState(false)
    const [visibleBanner, setVisibleBanner] = useState(false)
    const { userPosts, setUserPosts } = useContext(postContext)
    const [setErrors] = useState([])
    // const { sharedPosts, setSharedPosts } = props
    const authToken = window.localStorage.getItem('userToken')
    const { loggedInUser } = useContext(UserContext)
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({})
    const [profilePicture, setProfilePicture] = useState(null)
    const [coverPic, setCoverPic] = useState(null)

    const reload = () => window.location.reload()

    const pfpSubmitHandler = (e) => {
        e.preventDefault()

        const profileFormData = new FormData();
        profileFormData.append('file', profilePicture);

        axios.patch(`http://localhost:5000/user/${loggedInUser._id}/pfp/upload`, profileFormData)
            .then(res => {
                console.log(res.data)
                reload()
            })
            .catch((err) => {
                setErrors(err)
                console.log(err)
            });
    }

    const bannerSubmitHandler = (e) => {
        e.preventDefault()

        const profileFormData = new FormData();
        profileFormData.append('file', coverPic);
        profileFormData.append('imageType', "CoverPic");

        axios.patch(`http://localhost:5000/user/${loggedInUser._id}/banner/upload`, profileFormData)
            .then(res => {
                console.log(res.data)
                reload()
            })
            .catch((err) => {
                setErrors(err)
                console.log(err)
            });
    }


    useEffect(() => {
        if (loggedInUser && loggedInUser._id) {
        axios.get(`http://localhost:5000/user/${loggedInUser._id}`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            },
            withCredentials: true
        })
            .then(res => {
                console.log(res.data.user)
                setUser(res.data.user)
                setProfilePicture(res.data.user.profilePicture)
                setCoverPic(res.data.user.coverPic)
                console.log(res.data.user.coverPic)
                setLoading(false);
            })
            .catch(err => {
                console.log(err)
                setLoading(false);
            })
            }
    }, [setUser, loggedInUser, authToken])
    
    useEffect(() => {
        if (!loading && loggedInUser._id) {
            axios.get(`http://localhost:5000/posts/user/${loggedInUser._id}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                },
                withCredentials: true
            })
            .then(res => {
                setUserPosts(prevState => [...prevState, ...res.data.userPosts])
                console.log(res.data.userPosts)
            })
            .catch(err => {
                console.log(err)
            })
        }
    }, [setUserPosts, loggedInUser._id, loading, authToken])

    if (loading) {
        return <div>Loading Data...</div>;
    }

    return (
        <div className="">
            <div className='shadow-lg pt-5 border-solid border-black border-b pb-3 px-20 bg-gray-300' style={{ height: "21vh", marginLeft: '15%' }}>
                
                <img className='bg-center' src={`http://localhost:5000/public/images/${coverPic}`}  style={{ marginLeft: '15%', position: 'absolute', top: '0', right: '0', left: '0', width: '85%', height: '20.9vh', objectFit: 'cover'}} />
                <div className=''>
                    <div className='display: flex justify-end gap-5 position: sticky'>
                      <a className='bg-gray-500 shadow-md hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full' href="/feed">Your feed</a>
                      <Logout />
                    </div>
                    <div className='display: flex justify-end'>
                    <button className='bg-gray-500 shadow-md hover:bg-gray-400 text-white font-semibold py-2 px-4 rounded-full position: absolute mt-20' onClick={() => setVisibleBanner(true)}>Change banner picture</button>
                    <Model ariaHideApp={false} isOpen={visibleBanner} onRequestClose={() => setVisibleBanner(false)} style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(2px)', WebkitBackdropfilter: 'blur(2px)' }, content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', borderRadius: '16px', } }}>
                        <button className='pb-1 text-sm font-semibold border rounded-md bg-red-500 px-2 hover:bg-red-700 text-white me-7 position: absolute end-0' onClick={() => setVisibleBanner(false)}>x</button>
                        <label className='text-sm'>Upload banner</label>
                            <div className='display:flex justify-center flex-col my-2'>
                            <form onSubmit={bannerSubmitHandler}>
                            <input className='block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100' type="file" name="coverPic" onChange={(e) => setCoverPic(e.target.files[0])}/>
                            <button className='shadow-md bg-green-400 hover:bg-green-500 text-white text-sm font-bold py-2 px-4 rounded-full position: sticky mt-5 ms-24' >Done</button>
                             </form>
                        </div>
                    </Model>
                    </div>
                </div>
                <div className='display: flex justify-center gap-1'>
                    <span className='shadow-md rounded-full' style={{ position: 'absolute', top: '0', padding:'100.5px'}}><img className='rounded-full' src='https://avatarfiles.alphacoders.com/239/239030.jpg' style={{position: 'absolute', top: '0', right: '0', left: '0', width: '100%', height: '100%'}}/></span>
                    <button className='bg-transparent shadow-md hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-full position: sticky mt-28' onClick={() => setVisiblePfp(true)}>+</button>
                    <Model ariaHideApp={false} isOpen={visiblePfp} onRequestClose={() => setVisiblePfp(false)} style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(2px)', WebkitBackdropfilter: 'blur(2px)' }, content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', borderRadius: '16px', } }}>
                        <button className='pb-1 text-sm font-semibold border rounded-md bg-red-500 px-2 hover:bg-red-700 text-white me-7 position: absolute end-0' onClick={() => setVisiblePfp(false)}>x</button>
                        <label className='text-sm'>Upload profile picture </label>
                        <div className='display:flex justify-center flex-col my-2'>
                            <form onSubmit={pfpSubmitHandler}>
                            <input className='block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100' type="file" name="profilePicture" onChange={(e) => setProfilePicture(e.target.files[0])} />
                            <button className='shadow-md bg-green-400 hover:bg-green-500 text-white text-sm font-bold py-2 px-4 rounded-full position: sticky mt-5 ms-24' >Done</button>
                            </form>
                        </div>
                    </Model>
                </div>
            </div>
            <div>
                <PostModal />
                <FriendsList />
            </div>
            {loggedInUser._id == user._id && userPosts.length > 0 ? (userPosts.map((post) => (<Post key={post._id} post={post} user={user} />))) : (
                <div>
                     <p className='text-center' style={{ position: "absolute", top: "50%", left: "50%"}}>You dont have any posts yet.</p>
                </div>
            )}
        </div>
    );
}

export default Profile;

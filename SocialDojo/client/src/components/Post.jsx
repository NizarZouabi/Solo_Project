import CommentModal from "./CommentModal";
import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';
import { PostContext } from "../context/postContext";
import { UserContext } from "../context/userContext";
import { useContext, useState } from 'react';
import Model from 'react-modal';
import axios from 'axios';
const Post = (props) => {
    const { post, user, profilePic } = props
    const { userPosts, setUserPosts } = useContext(PostContext)
    const { loggedInUser } = useContext(UserContext)
    const authToken = window.localStorage.getItem('userToken')
    const formattedDate = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
    const [errors, setErrors] = useState({})
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [author] = useState(loggedInUser._id)
    const [file, setFile] = useState(null)
    const [visible, setVisible] = useState(false)

    Post.propTypes = {
        post: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired,
        profilePic: PropTypes.string
    }

    const removeFromDom = (postId) => {
        setUserPosts(userPosts.filter(post => post._id !== postId))
    }

    const removePost = () => {
        axios.delete(`http://localhost:5000/posts/${post._id}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            withCredentials: true})
            .then(res => {
                removeFromDom(post._id)
                console.log(res)
            })
        .catch((err) => console.log(err))
    }

    const submitHandler = (e) => {
        e.preventDefault()

        const updatedFormData = new FormData();
        updatedFormData.append('title', title)
        updatedFormData.append('content', content)
        updatedFormData.append('author', author)
        updatedFormData.append('file', file)
        

        axios.patch(`http://localhost:5000/posts/${post._id}/update`, updatedFormData)
            .then(res => {
                setUserPosts([...userPosts, res.data])
                setTitle('')
                setContent('')
                setFile(null)
            })
            .catch((err) => {
                setErrors(err.response.data.errors)
                console.log(err.response.data.errors)
            });
    }

    return (
        <div>
            <div>
                <div className='bg-gray-50 mt-24 mb-10 shadow-md border border-solid border-gray-400 rounded-lg position: sticky' style={{ display: "flex", flexDirection: "column", marginLeft: "29%", width: "60%"}}>
                <div className='bg-gray-200 shadow border-b border-solid border-gray-400 display: flex flex-column align-items-center'>
                    <span className='border-b border-solid border-gray-400 w-full text-transparent position: absolute top-14 left-0'></span>
                    {profilePic && profilePic !== "https://avatarfiles.alphacoders.com/239/239030.jpg" ? (<img className='border border-solid border-gray-400 rounded-full' src={`http://localhost:5000/public/images/${profilePic}`} style={{ position: 'sticky', top: '0.1%', left: '0.1%', width: '100px', height: '100px', objectFit: 'fill' }} />) : (<img className='border border-solid border-gray-400 rounded-full' src={user.profilePic} style={{ position: 'sticky', top: '0.1%', left: '0.1%', width: '10%', height: '23%', objectFit: 'fill' }} />)}
                    <div className='text-center m-3'>
                        <h1 className='position: absolute left-32 text-2xl font-bold'>{user.firstName} {user.lastName}</h1>
                        <div className=''>
                            <div className='position: absolute right-52'>
                                    {loggedInUser._id == post.author ? (<div><button className='hover:underline text-sm text-green-600 me-1' onClick={() => setVisible(true)}>Edit</button>
                                        <Model ariaHideApp={false} isOpen={visible} onRequestClose={() => setVisible(false)} style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(2px)', WebkitBackdropfilter: 'blur(2px)' }, content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', borderRadius: '16px', } }}>
                                            <button className='pb-1 mt-2 text-sm font-semibold border rounded-md bg-red-500 px-2 hover:bg-red-700 text-white me-7 position: absolute end-0' onClick={() => setVisible(false)}>x</button>
                                            <div className='border bg-gray-50' style={{ borderRadius: '16px' }}>
                                                <div className='display: flex justify-center'>
                                                    <form className='text-center text-xl py-5' style={{ width: '80%' }} onSubmit={submitHandler}>
                                                        <div className='display: flex flex-col mb-2'>
                                                            <label className='font-bold text-gray-600'>Title:</label>
                                                            <input className='p-1 m-1 border border-gray-400 rounded-lg' name='title' value={title} type="text" onChange={(e) => setTitle(e.target.value)} />
                                                            {errors.title ? <p className=' text-red-500'>{errors.title.message}</p> : null}
                                                        </div>
                                                        <div className='display: flex flex-col mb-2'>
                                                            <label className='font-bold text-gray-600'>Content:</label>
                                                            <textarea className='p-1 m-1 border border-gray-400 rounded-lg' rows={4} cols={40} name="content" value={content} type="text" onChange={(e) => setContent(e.target.value)} />
                                                            {errors.content ? <p className=' text-red-500'>{errors.content.message}</p> : null}
                                                        </div>
                                                        <div className='mb-2'>
                                                            <label className='text-sm'>Include an image or a video? </label>
                                                            <div className='display:flex flex row my-2'>
                                                                <input className='block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100' type="file" name="file" onChange={(e) => setFile(e.target.files[0])} />
                                                                {file ? <p className='my-1 border-0 font-semibold block px-2 pt-1 rounded-md text-sm text-green-800 bg-green-200'>Done</p> : null}
                                                            </div>
                                                        </div>
                                                        <button className='p-1 px-4 font-semibold text-white hover:bg-blue-600 m-1 bg-blue-500 rounded-full w-full shadow-md' type="submit">Post</button>
                                                    </form>
                                                </div>
                                            </div>
                                        </Model>
                                        <span className='cursor-default'>|</span> <button className='hover:underline text-sm text-red-600' onClick={removePost}>Delete</button></div>) : null}
                            </div>
                                <label className='position: absolute right-5 text-gray-500 text-sm italic'>{formattedDate}</label>
                        </div>
                        <h3 className='font-semibold' style={{ position: "absolute", top: "70px", left: "50%" }}>{post.title}</h3>
                    </div>
                </div>
                <div className="bg-gray-50">
                    <div className="">
                        <p className='container w-auto bg-white m-2 p-2 px-4 border border-gray-400 overflow-auto' style={{ height: "16vh" }}>{post.content}</p>
                        <span className='border-b border-solid border-gray-400 w-full text-transparent position: absolute bottom-50 left-0'></span>
                            <div className='container mt-4 bg-white overflow-y-auto w-auto m-2 p-2 px-4' style={{ height: "5%" }}>
                                {post.comments > 0 ?
                                (<div className='display: flex flex-row'>
                                <img className='border border-solid border-gray-400 rounded-full my-1' src='https://avatarfiles.alphacoders.com/239/239030.jpg' style={{ width: '4%', height: '9%' }} ></img>
                                <div className=' dislpay: flex flex-col position: sticky left-12'>
                                    <h5 className='text-lg font-semibold'>Username</h5>
                                    <div className='display: flex flex-row'>
                                        <p className='container text-pretty border rounded-lg px-1 overflow-y-auto bg-white' style={{ height: "50px", width: "100%" }}>Comment</p>
                                        <p className='ms-2'>0</p>
                                        <button className='mb-5'><img src="https://w7.pngwing.com/pngs/710/952/png-transparent-computer-icons-star-star-thumbnail.png" className="position: sticky ms-2" style={{ height: '30px', width: '30px' }} /></button>
                                    </div>
                                </div>
                            </div>) : (<div className="display: flex justify-center "><p>No comments yet.</p></div>)}
                        </div>
                    </div>
                </div>
                <div className='display: flex justify-center'>
                    <CommentModal />
                    </div>
            </div>
            </div>
        </div>
    );
}

export default Post;

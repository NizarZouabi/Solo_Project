import CommentModal from "./CommentModal";
import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';
const Post = (props) => {
    const { post, user } = props

    const formattedDate = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

    Post.propTypes = {
        post: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired
    }

    return (
        <div>
            <div>
                <div className='bg-gray-50 mt-24 mb-10 shadow-md border border-solid border-gray-400 rounded-lg position: sticky' style={{ display: "flex", flexDirection: "column", marginLeft: "29%", width: "60%"}}>
                <div className='bg-gray-200 shadow border-b border-solid border-gray-400 display: flex flex-column align-items-center'>
                    <span className='border-b border-solid border-gray-400 w-full text-transparent position: absolute top-14 left-0'></span>
                    <img className='border border-solid border-gray-400 rounded-full' src='https://avatarfiles.alphacoders.com/239/239030.jpg' style={{ position: 'sticky', top: '0.1%', left: '0.1%', width: '10%', height: '23%' }} />
                    <div className='text-center m-3'>
                        <h1 className='position: absolute left-32 text-2xl font-bold'>{user.firstName} {user.lastName}</h1>
                        <div className=''>
                            <div className='position: absolute right-52'>
                                <button className='hover:underline text-sm text-green-600'>Edit</button> <span className='cursor-default'>|</span> <button className='hover:underline text-sm text-red-600'>Delete</button>
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

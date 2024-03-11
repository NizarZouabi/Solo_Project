import Model from 'react-modal';
import PostForm from '../components/PostForm';
import { useState } from 'react';

const PostModal = () => {
    const [visible, setVisible] = useState(false)
    return (
        <div className='position: sticky'>
            <input className='px-5 py-1 mt-10 bg-white border rounded-xl border-gray-400 shadow-md outline-yellow-200' style={{ position: 'absolute', left: '420px', top: '60px', width: '73%' }} placeholder='Write a post' onClick={() => setVisible(true)}></input>
            <Model ariaHideApp={false} isOpen={visible} onRequestClose={() => setVisible(false)} style={{  overlay: { backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(2px)', WebkitBackdropfilter: 'blur(2px)'}, content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', borderRadius: '16px', } }}>
                <button className='pb-1 text-sm font-semibold border rounded-md bg-red-500 px-2 hover:bg-red-700 text-white mt-2 me-7 position: absolute end-0' onClick={() => setVisible(false)}>x</button>
                <PostForm />
            </Model>
        </div>
    );
}

export default PostModal;

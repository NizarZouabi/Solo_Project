import CommentForm from "./CommentForm";
import { useState } from "react";
import Model from 'react-modal';

const CommentModal = () => {
    const [visible, setVisible] = useState(false)
    return (
        <div>
            <div className='display: flex flex-row gap-3 pb-2'>
                <label className='font-bold text-lg text-gray-600'>Comment:</label>
                <input className='shadow-md border border-solid border-gray-400 rounded-lg' type='text' onClick={() => setVisible(true)} />
                <Model ariaHideApp={false} isOpen={visible} onRequestClose={() => setVisible(false)} style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(2px)', WebkitBackdropfilter: 'blur(2px)' }, content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', borderRadius: '16px', } }}>
                    <button className='pb-1 text-sm font-semibold border rounded-md bg-red-500 px-2 hover:bg-red-700 text-white mt-2 me-7 position: absolute end-0' onClick={() => setVisible(false)}>x</button>
                    <CommentForm />
                </Model>
            </div>
        </div>
    );
}

export default CommentModal;

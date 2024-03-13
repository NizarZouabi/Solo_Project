

const CommentForm = () => {
    return (
        <div className='border bg-gray-50' style={{borderRadius: '16px'}}>
            <div className='display: flex justify-center'>
                <form className='text-center text-xl py-5' style={{ width: '80%' }}>
                    <div className='display: flex flex-col mb-2'>
                        <label className='font-bold text-gray-600'>Comment:</label>
                        <textarea type="text" cols={40} rows={20} className='p-4 m-1 border border-gray-400 rounded-lg h-24' name='comment'/>
                    </div>
                    <button className='shadow-md bg-blue-400 hover:bg-blue-500 text-white text-sm font-bold py-2 px-4 rounded-full'>Add</button>
                </form>
            </div>
        </div>
    );
}

export default CommentForm;

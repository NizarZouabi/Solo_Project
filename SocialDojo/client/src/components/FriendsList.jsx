
const FriendsList = () => {
    return (
        <div className="container position: sticky border-r border-black w-1/6 p-2 bg-gray-300" style={{flex: 1, overflowY: 'auto',height: '100vh'}}>
            <div>
                <img src="https://cdn3.iconfinder.com/data/icons/star-glyph/64/Star-search-find-investigate-512.png" className="position: absolute mt-3.5 ms-4" style={{height: '2%', width: '6%'}}/><input className="ps-7 p-0.5 border rounded-lg border-gray-400 m-2 outline-none" style={{width: '95%'}} type="search" placeholder='Search'/>
           </div>
            <div className="p-2 bg-gray-50 border border-gray-400 overflow-auto" style={{ height: '88vh'}}>
            <ul className="display-flex gap-2 text-xl ps-4" style={{height: '92vh'}}>
                <div className=''></div><li className="p-2 font-bold">Friend</li>
            </ul>
            </div>
            <div className="display: flex flex-row gap-2 ms-14 mb-1 p-3 position: absolute bottom-0">
                <img src="https://static.thenounproject.com/png/4306405-200.png" style={{ width: '15%', height: '15%', borderRadius: '80%', cursor: 'pointer' }} /><a href="/feed" className='font-bold mt-2 underline'>Look for a friend</a>
            </div>
        </div>
    );
}

export default FriendsList;

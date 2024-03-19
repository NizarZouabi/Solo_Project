import { Tooltip, Button } from "@material-tailwind/react";
import { UserContext } from "../context/userContext";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Requests() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const { loggedInUser } = useContext(UserContext);
  const [visible, setVisible]  = useState(false);
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (loggedInUser && loggedInUser._id) {
      axios
        .get(`http://localhost:5000/user/${loggedInUser._id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data);
          setPendingRequests(res.data.user.pendingRequests);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loggedInUser, authToken]);

  const cancelRequest = (senderId) => {

    axios
      .patch(
        `http://localhost:5000/user/${senderId}/friend/${loggedInUser._id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        setPendingRequests(pendingRequests.filter(request => request.senderId !== senderId));
        console.log(res.data);
        reload();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const addFriend = (senderId) => {
    
    axios.post(`http://localhost:5000/user/${loggedInUser._id}/friend/${senderId}/add`, {},
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      withCredentials: true,
    })
    .then((res) => {
      setPendingRequests(pendingRequests.filter(request => request.senderId !== senderId));
    })
  }



  return (
    <div>
      <Tooltip
        className="shadow border border-gray-400 w-1/6 py-5 text-center bg-gray-50"
        placement="bottom"
        interactive={true}
        content={pendingRequests.length > 0 ? pendingRequests.map((request, idx) => (<div key={idx} className="bg-white shadow display: flex justify-between flex-row p-2 my-1 container border">
              {request.sender.profilePic ? (<img src={`http://localhost:5000/public/images/${request.sender.profilePic}`} className="border border-gray-400 rounded-full overflow-y-auto ms-3" style={{ width: "50px", height: "50px"}}/>) : (<img src="https://avatarfiles.alphacoders.com/239/239030.jpg" className="border border-gray-400 rounded-full overflow-y-auto ms-3" style={{ width: "50px", height: "50px"}}/>) }
            <span className="font-semibold text-black mt-2 text-lg"><Link to ={`/user/${request.senderId}`}>{request.sender.firstName} {request.sender.lastName}</Link></span><div className="display: flex flex-row justify-center gap-3 h-5 mt-3 me-2"><button className="text-white rounded-full shadow bg-green-400 w-5 text-center cursor-pointer" onClick={() => addFriend(request.senderId)}>✓</button><span className="text-white rounded-full shadow bg-red-400 w-5 text-center cursor-pointer" onClick={() => cancelRequest(request.senderId)}>X</span></div>
          </div>)) : (<div><p className="text-black">No Requests yet.</p></div>)
        }
        open={visible}
        animate={{
          mount: { scale: 1, y: -3 },
          unmount: { scale: 0, y: 25 },
        }}
      >
        <Button onClick={() => setVisible(!visible)} className="shadow-md bg-gray-500 hover:bg-blue-700 text-white font-bold py-2 rounded-full ms-24">
          Requests
          {pendingRequests.length > 0 ? (
            <span className="rounded-full shadow bg-red-400 ms-2 px-2">{pendingRequests.length}</span>
          ) : null}
        </Button>
      </Tooltip>
    </div>
  );
}

export default Requests;

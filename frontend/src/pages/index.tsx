import {useState, useEffect} from 'react';
import Modal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';
import { io, Socket } from 'socket.io-client'


export default function Home() {

  const [roomID, setRoomID] = useState(uuidv4().slice(0, 8));
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIO = io('http://localhost:4000');
    setSocket(socketIO);

  }, [])

  const handleSubmit = () =>
  {
    socket?.emit('join', roomID);
  }

  return (
    <div>
      <Modal
      isOpen={true}>
        <h2>Welcome to AMC-Bowl</h2>
        <p>
          Enter the name of a room to go to or simply hit the go button to create a new empty room.
          You can then invite friends to join you by sharing the URL.
        </p>


        <form onSubmit={handleSubmit}>
          <input value={roomID} placeholder={roomID} onChange={(e) => setRoomID(e.target.value)}></input>
          <button> Go to Room </button>
        </form>


      </Modal>
    </div>
  )
}

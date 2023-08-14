import {useState} from 'react';
import Modal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';
import useSocket from '../hooks/Socket'


export default function Home() {

  const [roomID, setRoomID] = useState(uuidv4().slice(0, 8));
  const {socket} = useSocket((state) => ({socket: state.socket}))

  const handleSubmit = (e: any) =>
  {
    e.preventDefault();

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

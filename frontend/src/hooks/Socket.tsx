import {create} from 'zustand';
import {Socket} from 'socket.io-client'

interface ISocket {
    socket: Socket | null
    setSocket: (sct: Socket | null) => void
}

const useSocket = create<ISocket>()(
    (set) =>
    (
        {
            socket: null,
            setSocket: (sct) => set({socket: sct})
        }
    )
)

export default useSocket;
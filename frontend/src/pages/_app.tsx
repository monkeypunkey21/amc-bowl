import type { AppProps } from 'next/app'
import useSocket from '../hooks/Socket'
import { io } from 'socket.io-client'
import {useEffect} from 'react';


export default function App({ Component, pageProps }: AppProps) {
  const {socket, setSocket} = useSocket((state) => ({socket: state.socket, setSocket: state.setSocket}))

  useEffect(() => {
    const socketIO = io('http://localhost:4000');
    setSocket(socketIO);

    return () =>
    {
      socketIO.disconnect()
    }
  }, [])

  return <Component {...pageProps} />
}

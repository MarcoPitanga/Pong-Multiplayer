import socketClient from 'socket.io-client'
import { useEffect, useState } from 'react'
import { PlayerList } from './PlayerList'
import { Chat } from './Chat'

let socket

export const Pong = () => {
  const [players, setPlayers] = useState({})
  const [messages, setMessages] = useState('')

  useEffect(() => {
    socket = socketClient('http://localhost:4000')
    socket.on('connect', () => {
      console.log('Conectado!')
    })
  }, [])

  useEffect(() => {
    socket.on('playerRefresh', (players) => {
      setPlayers(players)
    })
  }, [])

  useEffect(() => {
    socket.on('receiveMessage', (receivedMessage) => {
      setMessages(messages + receivedMessage + '\n\n')
    })
  }, [messages])

  const sendMessage = (message) => {
    socket.emit('sendMessage', message)
  }

  return (
    <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
      <PlayerList players={players} />
      <Chat sendMessage={sendMessage} messages={messages} />
    </div>
  )
}

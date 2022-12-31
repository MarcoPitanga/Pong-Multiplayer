import socketClient from 'socket.io-client'
import { useEffect } from 'react'
import { useState } from 'react'

const socket = socketClient('http://localhost:4000')

export const Pong = () => {
  const [players, setPlayers] = useState({})

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Conectado!')
    })

    socket.on('playerRefresh', (players) => {
      setPlayers(players)
    })
  }, [])

  return (
    <div>
      {Object.keys(players).map((key) => (
        <div key={players[key].name.toString()}>{players[key].name}</div>
      ))}
    </div>
  )
}

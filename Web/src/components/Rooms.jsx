import React, { useContext } from 'react'
import { createRoom, GameContext, joinRoom, leaveRoom } from '../contexts/GameContext'

export const Rooms = () => {
  const { player, rooms } = useContext(GameContext)

  return (
    <div style={{ marginBottom: '20px' }}>
      {!player.room ? (
        <div>
          <button onClick={createRoom}>Criar Sala</button>
          {Object.keys(rooms).map((key) => (
            <div key={`room_${key}`}>
              {rooms[key].name}{' '}
              <button onClick={() => joinRoom(key)} disabled={rooms[key].player1 && rooms[key].player2}>
                Entrar
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {rooms[player.room] && rooms[player.room].player1 && rooms[player.room].player2 ? (
            <button>Iniciar Jogo</button>
          ) : (
            <div>Aguardando outro jogador conectar na sala</div>
          )}
          <button onClick={leaveRoom}>Sair da Sala</button>
        </div>
      )}
    </div>
  )
}

import React, { useContext } from 'react'
import { createRoom, GameContext, joinRoom, leaveRoom } from '../contexts/GameContext'
import { Button } from './Button'

export const Rooms = () => {
  const { player, rooms } = useContext(GameContext)

  return (
    <div className="mb-10 text-center">
      <h2 className="text-2xl font-semibold m-4">Lista de Salas</h2>
      {!player.room ? (
        <div>
          <Button text="Criar Sala" onClick={createRoom} />
          <div className="max-h-full ">
            {Object.keys(rooms).map((key) => (
              <div key={`room_${key}`} className="flex text-lg font-semibold m-2 justify-between">
                {rooms[key].name}{' '}
                <Button
                  text="Entrar"
                  onClick={() => joinRoom(key)}
                  disabled={rooms[key].player1 && rooms[key].player2}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {rooms[player.room] && rooms[player.room].player1 && rooms[player.room].player2 ? (
            <Button text="Iniciar Jogo" className="m-1" />
          ) : (
            <div>Aguardando outro jogador conectar na sala</div>
          )}
          <Button text="Sair da Sala" className="m-1" onClick={leaveRoom} />
        </div>
      )}
    </div>
  )
}

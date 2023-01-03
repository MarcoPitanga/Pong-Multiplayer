import { useContext } from 'react'
import { PlayerList } from './PlayerList'
import { Chat } from './Chat'
import { GameContext, sendMessage, createRoom, leaveRoom } from '../contexts/GameContext'

export const Pong = () => {
  const { isConnected, players, messages, player, rooms } = useContext(GameContext)

  return (
    <>
      {!isConnected && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Conectando...</div>
      )}
      <div>
        <div style={{ marginBottom: '20px' }}>
          {!player.room ? (
            <div>
              <button onClick={createRoom}>Criar Sala</button>
              {Object.keys(rooms).map((key) => (
                <div key={`room_${key}`}>{rooms[key].name}</div>
              ))}
            </div>
          ) : (
            <div>
              Aguardando outro jogador conectar na sala
              <button onClick={leaveRoom}>Sair da Sala</button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
          <PlayerList players={players} />
          <Chat sendMessage={sendMessage} messages={messages} />
        </div>
      </div>
    </>
  )
}

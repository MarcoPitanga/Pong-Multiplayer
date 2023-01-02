import { useContext } from 'react'
import { PlayerList } from './PlayerList'
import { Chat } from './Chat'
import { GameContext, sendMessage } from '../contexts/GameContext'

export const Pong = () => {
  const { isConnected, players, messages } = useContext(GameContext)

  return (
    <>
      {!isConnected && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Conectando...</div>
      )}

      <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
        <PlayerList players={players} />
        <Chat sendMessage={sendMessage} messages={messages} />
      </div>
    </>
  )
}

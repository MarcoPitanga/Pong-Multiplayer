import { useContext } from 'react'
import { PlayerList } from './PlayerList'
import { Chat } from './Chat'
import { GameContext, sendMessage } from '../contexts/GameContext'
import { Rooms } from './Rooms'
import { Loading } from './Loading'
import { Game } from './Game'

export const Pong = () => {
  const { isConnected, players, messages, match } = useContext(GameContext)
  return (
    <div className="bg-gray-900 text-white w-screen h-screen">
      {!isConnected ? (
        <Loading />
      ) : match.status ? (
        <Game />
      ) : (
        <div className="flex flex-row h-full">
          <div className="mr-5 bg-gray-800 p-2.5 shadow-md max-w-xs w-80">
            <Rooms />
            <PlayerList players={players} />
          </div>
          <div className="flex-1">
            <Chat sendMessage={sendMessage} messages={messages} />
          </div>
        </div>
      )}
    </div>
  )
}

import { Pong } from '../../components/Pong'
import { GameProvider } from '../../contexts/GameContext'

export const Home = () => {
  return (
    <div className="">
      <GameProvider>
        <Pong />
      </GameProvider>
    </div>
  )
}

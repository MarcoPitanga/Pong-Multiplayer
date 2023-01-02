import { Pong } from '../../components/Pong'
import { GameProvider } from '../../contexts/GameContext'
import './styles.css'

export const Home = () => {
  return (
    <GameProvider>
      <Pong />
    </GameProvider>
  )
}

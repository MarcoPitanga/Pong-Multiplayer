import React, { useEffect, useContext } from 'react'
import SVG, { Circle, Rect, Line } from 'react-svg-draw'
import { gameLoaded, GameContext, leaveRoom, sendKey } from '../contexts/GameContext'
import { Button } from './Button'

export const Game = () => {
  const { match } = useContext(GameContext)
  const { gameConfig, ball, message, player1, player2 } = match

  useEffect(() => {
    gameLoaded()

    const sendKeyEvent = (e) => {
      const { key, type } = e

      switch (key) {
        case 'ArrowUp':
        case 'ArrowDown':
          sendKey(type, key)
          e.preventDefault()
          break
      }
    }

    document.addEventListener('keydown', sendKeyEvent)
    document.addEventListener('keyup', sendKeyEvent)

    return () => {
      document.removeEventListener('keydown', sendKeyEvent)
      document.removeEventListener('keyup', sendKeyEvent)
    }
  }, [])

  return (
    <div className="relative">
      <SVG width={gameConfig.width.toString()} height={gameConfig.height.toString()}>
        <Rect
          x="0"
          y="0"
          width={gameConfig.width.toString()}
          height={gameConfig.height.toString()}
          style={{ fill: 'rgb(0, 0, 0)' }}
        />
        <Line
          x1={(gameConfig.width / 2).toString()}
          y1="0"
          x2={(gameConfig.width / 2).toString()}
          y2={gameConfig.height.toString()}
          strokeDasharray="5,5"
          strokeWidth="5"
          style={{ stroke: 'rgba(255, 255, 255, 0.5)' }}
        />

        <text
          x={(gameConfig.width / 2 - 20).toString()}
          y="45"
          className="fill-[#ffffff]/[0.7] text-5xl"
          direction="rtl"
        >
          {match.score1}
        </text>

        <text x={(gameConfig.width / 2 + 20).toString()} y="45" className="fill-[#ffffff]/[0.7] text-5xl">
          {match.score2}
        </text>

        {ball && (
          <Circle cx={ball.x.toString()} cy={ball.y.toString()} r={ball.width.toString()} style={{ fill: '#fff' }} />
        )}
        {player1 && (
          <Rect
            x={player1.x.toString()}
            y={player1.y.toString()}
            width={player1.width.toString()}
            height={player1.height.toString()}
            style={{ fill: 'rgb(255, 255, 255)' }}
          />
        )}
        {player2 && (
          <Rect
            x={player2.x.toString()}
            y={player2.y.toString()}
            width={player2.width.toString()}
            height={player2.height.toString()}
            style={{ fill: 'rgb(255, 255, 255)' }}
          />
        )}
      </SVG>

      {message && (
        <div className="absolute w-80 bg-gray-900 p-5 text-center">
          <h4>{message}</h4>
          <Button onClick={leaveRoom} text="Voltar" />
        </div>
      )}
    </div>
  )
}

/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import socketClient from 'socket.io-client'
import { createContext, useEffect, useReducer } from 'react'

const socket = socketClient('http://localhost:4000', {
  autoConnect: false
})

export const GameContext = createContext()

const reducer = (state, action) => {
  switch (action.type) {
    case 'CONNECTED':
      return {
        ...state,
        isConnected: action.payload
      }

    case 'PLAYERS':
      return {
        ...state,
        players: action.payload
      }

    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload]
      }

    default:
      return state
  }
}

const initialState = {
  isConnected: false,
  players: {},
  messages: []
}

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    socket.on('connect', () => {
      dispatch({ type: 'CONNECTED', payload: true })
    })
    socket.on('disconnect', () => {
      dispatch({ type: 'CONNECTED', payload: false })
    })
    socket.on('playerRefresh', (players) => {
      dispatch({ type: 'PLAYERS', payload: players })
    })
    socket.on('receiveMessage', (receivedMessage) => {
      dispatch({ type: 'ADD_MESSAGE', payload: receivedMessage })
    })
    socket.open()
  }, [])

  return <GameContext.Provider value={state}>{children}</GameContext.Provider>
}

export const sendMessage = (message) => {
  socket.emit('sendMessage', message)
}

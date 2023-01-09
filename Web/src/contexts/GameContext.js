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
    case 'PLAYER':
      return {
        ...state,
        player: action.payload
      }
    case 'PLAYERS':
      return {
        ...state,
        players: action.payload
      }
    case 'ROOM':
      return {
        ...state,
        room: state.rooms[state.players[action.payload].room]
      }
    case 'ROOMS':
      return {
        ...state,
        rooms: action.payload
      }
    case 'MATCH':
      return {
        ...state,
        match: action.payload
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
  player: {},
  room: {},
  rooms: {},
  players: {},
  messages: [],
  match: {}
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
      dispatch({ type: 'PLAYER', payload: players[socket.id] })
    })
    socket.on('receiveMessage', (receivedMessage) => {
      dispatch({ type: 'ADD_MESSAGE', payload: receivedMessage })
    })
    socket.on('roomsRefresh', (rooms) => {
      dispatch({ type: 'ROOMS', payload: rooms })
      dispatch({ type: 'ROOM', payload: socket.id })
    })
    socket.on('matchRefresh', (match) => {
      dispatch({ type: 'MATCH', payload: match })
    })
    socket.open()
  }, [])

  return <GameContext.Provider value={state}>{children}</GameContext.Provider>
}

export const sendMessage = (message) => {
  socket.emit('sendMessage', message)
}

export const createRoom = () => {
  socket.emit('createRoom')
}

export const leaveRoom = () => {
  socket.emit('leaveRoom')
}

export const joinRoom = (roomId) => {
  socket.emit('joinRoom', roomId)
}

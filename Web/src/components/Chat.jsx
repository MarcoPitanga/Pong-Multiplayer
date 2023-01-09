import { element } from 'prop-types'
import { useState, useEffect } from 'react'
import { Button } from './Button'
import { Input } from './Input'

export const Chat = ({ sendMessage, messages }) => {
  const [messageToSend, setMessageToSend] = useState('')

  useEffect(() => {
    const elem = document.getElementById('chat-content')
    elem.scrollTop = element.scrllHeight
  }, [messages])

  return (
    <div className="bg-gray-800 h-full p-3 shadow-md flex-1 flex flex-col">
      <div id="chat-content" className="whitespace-pre-wrap h-full overflow-auto">
        {messages.join('\n\n')}
      </div>
      <div className="flex justify-between items-center">
        <Input
          type="text"
          className="w-full col-span-4"
          value={messageToSend}
          onChange={(e) => setMessageToSend(e.target.value)}
        />
        <Button
          text="Enviar"
          disabled={!messageToSend.trim()}
          onClick={() => {
            sendMessage(messageToSend)
            setMessageToSend('')
          }}
        />
      </div>
    </div>
  )
}

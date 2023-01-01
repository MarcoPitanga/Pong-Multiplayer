import { useState } from 'react'

export const Chat = ({ sendMessage, messages }) => {
  const [messageToSend, setMessageToSend] = useState('')

  return (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div style={{ whiteSpace: 'pre-wrap' }}>{messages}</div>
      <input type="text" value={messageToSend} onChange={(e) => setMessageToSend(e.target.value)} />
      <button onClick={() => sendMessage(messageToSend)}>Enviar</button>
    </div>
  )
}

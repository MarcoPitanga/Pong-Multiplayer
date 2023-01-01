export const PlayerList = ({ players }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '10%' }}>
      <h3>Lista de Players</h3>
      {Object.keys(players).map((key) => (
        <div key={players[key].name.toString()}>{players[key].name}</div>
      ))}
    </div>
  )
}

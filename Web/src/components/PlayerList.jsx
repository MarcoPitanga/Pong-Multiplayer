export const PlayerList = ({ players }) => {
  return (
    <div className="mb-5">
      <span className="text-indigo-500 text-2xl font-semibold mb-3 flex justify-between items-center">
        Lista de Players
      </span>
      <div>
        {Object.keys(players).map((key) => (
          <div
            className="text-lg flex justify-between border-b-gray-300 items-center pb-1 pt-1"
            key={players[key].name.toString()}
          >
            {players[key].name}
          </div>
        ))}
      </div>
    </div>
  )
}

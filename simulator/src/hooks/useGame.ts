import { useContext } from 'react'
import GameContext from '../context/GameContext'

const useGame = () => useContext(GameContext)

export default useGame

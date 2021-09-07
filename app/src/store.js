import { configureStore } from '@reduxjs/toolkit'
import playerReducer from './player/playerSlice'

export const store = configureStore({
  reducer: {
    player: playerReducer,
  },
})
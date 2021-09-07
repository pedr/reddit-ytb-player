import { createSlice } from '@reduxjs/toolkit'

const modes = {
  new: "new",
  random: "random",
  hot: "hot",
};

const initialState = {
  playing: false,
  mode: modes.new,
  pause: false,
  trackSelected: 0,
  videoId: '',
  tracks: [],
}

export const playerSlice = createSlice({ 
  name: 'player', 
  initialState, 
  reducers: {
    play: (state) => {
      state.playing = true;
      state.pause = false;
      state.videoId = state.tracks[state.trackSelected].videoId;
    },
    pause: (state) => {
      state.pause = !state.pause
    },
    next: (state) => {
      let val = 0;
      if (state.trackSelected + 1 == state.tracks.length) {
        val = 0;
      } else {
        val = state.trackSelected + 1;
      }

      state.trackSelected = val;
      state.videoId = state.tracks[val].videoId;
    },
    previous: (state) => {
      let val = 0;
      if (state.trackSelected === 0) {
        val = state.tracks.length - 1;
      } else {
        val = state.trackSelected - 1;
      }

      state.trackSelected = val;
      state.videoId = state.tracks[val].videoId;
    },
    loadTracks: (state, action) => {
      let videoId = null;

      if (state.videoId === '') {
        videoId = action.payload[0].videoId
      } else {
        videoId = state.videoId
      }

      state.tracks = [...state.tracks, ...action.payload];
      state.videoId = videoId;
    },
    replaceTracks: (state, action) => {
      let videoId = action.payload[0].videoId

      state.tracks = [ ...action.payload];
      state.videoId = videoId;
    }
  },
})

export const { play, pause, next, previous, loadTracks, replaceTracks } = playerSlice.actions;
export default playerSlice.reducer
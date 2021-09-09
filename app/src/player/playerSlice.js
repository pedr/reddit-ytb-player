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
  shouldFetchMoreContent: false,
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
      let numberTrack = 0;
      if (state.trackSelected + 1 == state.tracks.length) {
        numberTrack = 0;
      } else {
        numberTrack = state.trackSelected + 1;
      }

      let shouldFetchMoreContent = false;
      if (state.trackSelected + 2 >= state.tracks.length) {
        shouldFetchMoreContent = true;
      }

      state.trackSelected = numberTrack;
      state.videoId = state.tracks[numberTrack].videoId;
      state.shouldFetchMoreContent = shouldFetchMoreContent;
    },
    finishedLoadingContent: (state) => {
      state.shouldFetchMoreContent = false;
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
      let trackSelected = 0;

      if (state.videoId === '') {
        videoId = action.payload[trackSelected].videoId
      } else {
        videoId = state.videoId
        trackSelected = state.trackSelected;
      }

      state.tracks = [...state.tracks, ...action.payload];
      state.videoId = videoId;
      state.trackSelected = state.trackSelected;
    },
    replaceTracks: (state, action) => {
      let videoId = action.payload[0].videoId

      state.tracks = [ ...action.payload];
      state.videoId = videoId;
    }
  },
})

export const { play, pause, next, finishedLoadingContent, previous, loadTracks, replaceTracks } = playerSlice.actions;
export default playerSlice.reducer
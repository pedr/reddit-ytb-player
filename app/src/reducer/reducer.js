const actionTypes = {
  play: "player/play",
  pause: "player/pause",
  next: "player/next",
  previous: "player/previous",
  loadTracks: "player/loadTracks",
};

const modes = {
  new: "new",
  random: "random",
  topOfTheWeek: "topOfTheWeek",
  hot: "hot",
};

const initialState = {
  playing: false,
  mode: modes.new,
  pause: false,
  trackSelected: 0,
  videoId: '',
  tracks: [],
};

const actionNext = (state) => {
  let val = 0;
  if (state.trackSelected + 1 == state.tracks.length) {
    val = 0;
  } else {
    val = state.trackSelected + 1;
  }

  return {
    ...state,
    trackSelected: val,
    videoId: state.tracks[val].videoId,
  };
};

const actionPrevious = (state) => {
  let val = 0;
  if (state.trackSelected === 0) {
    val = state.tracks.length - 1;
  } else {
    val = state.trackSelected - 1;
  }

  return {
    ...state,
    trackSelected: val,
    videoId: state.tracks[val].videoId,
  };
};

const playerReducer = (state, action) => {
  const debug = true;
  if (debug) {
    console.log({
      state,
      action,
    });
  }
  switch (action.type) {
    case actionTypes.play:
      return {
        ...state,
        playing: true,
        pause: false,
        videoId: state.tracks[state.trackSelected].videoId
      };
    case actionTypes.pause:
      return {
        ...state,
        pause: !state.pause,
      };
    case actionTypes.next:
      return actionNext(state, action.payload)
    case actionTypes.previous:
      return actionPrevious(state, action.payload)
    case actionTypes.loadTracks:
      let videoId
      if (state.videoId === '') {
        videoId = action.payload[0].videoId
      } else {
        videoId = state.videoId
      }

      return {
        ...state,
        tracks: [...state.tracks, ...action.payload],
        videoId: videoId
      };
    default: 
      return state;
  }
};

export { playerReducer, initialState, actionTypes };

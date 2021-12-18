

import React from "react";
import YouTube from "react-youtube";
import { useSelector, useDispatch  } from 'react-redux'

import { next,previous, play } from './playerSlice'
import './YoutubePlayer.css'

const YoutubePlayer = () => {

  const videoId = useSelector(state => state.player.videoId)
  const playListSource = useSelector(state => state.player.playListSource)
  const dispatch = useDispatch()
  
  const goBack = () => {
    dispatch(previous())
  };

  const goNext = () => {
    dispatch(next())
  };

  const onPlay = () => {
    dispatch(play())
  }

  return <div style={{gridArea: 'video'}}>
    <div className="my-2">Playing <h2 className="text-success d-inline">{playListSource.title}</h2> </div>
    { videoId && videoId.length > 0 && 
      <div className="player-wrapper">
        <YouTube
          className="react-player"
          videoId={videoId}
          opts={{
            width: "100%",
            height: '100%',
            playerVars: {
              autoplay: 1,
            },
          }}
          onPlay={onPlay}
          onEnd={goNext}
        />
      </div>
    }
    <div style={{ marginBottom: '1em' }} >
      <button className="btn btn-secondary me-1" onClick={goBack}>Previous</button>
      <button className="btn btn-secondary me-1" onClick={goNext}>Next</button>
    </div>
  </div>
}

export default YoutubePlayer;
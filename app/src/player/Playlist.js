
import React from "react";
import { useSelector, useDispatch  } from 'react-redux'

import { selectTrack } from './playerSlice'

const Playlist = () => {

  const tracks = useSelector(state => state.player.tracks)
  const trackSelected = useSelector(state => state.player.trackSelected)
  const dispatch = useDispatch()
  
  const onClickToSelectTrack = (track) => {
    dispatch(selectTrack({ videoId: track.videoId }))
  }

  return <div style={{ display: 'flex', flexDirection: 'column', marginTop: "1.5em", gridArea: 'playlist', maxHeight: '400px', overflowY: 'scroll'}}>
    {tracks &&
      tracks.map((post, index) => {
        return (
          <span
            key={post.id}
            style={{
              padding: '1em 1em 1em 1.5em',
              // margin: '-0.5em -1em 0',
              backgroundColor: index === trackSelected ? "rgb(83, 174, 98)" : "inherit"
            }}
            className={`d-flex align-items-center justify-content-between ${index === trackSelected ? "text-dark" : "text-light"}`}
          >
            <div className="d-flex align-items-center">
              <div className={`fs-3 px-1 me-1 d-inline ${index === trackSelected ? "bg-warning rounded-circle" : ""}`}>
                <i
                  onClick={() => onClickToSelectTrack(post)}
                  className={`bi ${index === trackSelected ? `bi-volume-up text-black` : "bi bi-play-circle"}`}
                />
              </div>
              <span className="me-2">
                {`${post.title} - score ${post.score} - comments ${post.num_comments}`}
              </span>
            </div>
            <a className="p-1" href={`https://reddit.com${post.permalink}`} target="_blank">
              <i className="bi bi-box-arrow-up-right" />
            </a>
          </span>
        );
      })}
  </div>
}

export default Playlist;
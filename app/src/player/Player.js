
import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import { useSelector, useDispatch  } from 'react-redux'

import { getValidPosts, getRedditNewest, getRedditRandom } from '../helpers';
import { loadTracks, next, finishedLoadingContent, previous, play, selectTrack } from './playerSlice'

const Player = () => {
//  const [state, dispatch] = useReducer(playerReducer, initialState)
  const [subName, setSubName] = useState('musicanova')

  const tracks = useSelector(state => state.player.tracks)
  const trackSelected = useSelector(state => state.player.trackSelected)
  const videoId = useSelector(state => state.player.videoId)
  const shouldFetchMoreContent = useSelector(state => state.player.shouldFetchMoreContent)
  const dispatch = useDispatch()
  
  const getNewest = async () => {
    const response = await getRedditNewest(subName);

    const posts = response.map((post) => {
      return {
        id: post.data.id,
        url: post.data.url,
        title: post.data.title,
        score: post.data.score,
        permalink: post.data.permalink,
        num_comments: post.data.num_comments,
      };
    });

    const validPosts = getValidPosts(posts);

    dispatch(loadTracks(validPosts))

  };

  const goBack = () => {
    dispatch(previous())
  };

  const goNext = () => {
    dispatch(next())
  };

  const getRandom = async () => {
    let validPosts = [];
    let tries = 0;

    while (validPosts.length < 5 && tries < 10) {
      tries += 1;
      const response = await getRedditRandom(subName);

      const posts = response.map((post) => {
        return {
          id: post.data.id,
          url: post.data.url,
          title: post.data.title,
          score: post.data.score,
          permalink: post.data.permalink,
          num_comments: post.data.num_comments,
        };
      });

      validPosts = [...validPosts, ...getValidPosts(posts)];

    }

    dispatch(loadTracks(validPosts));
  };

  const onPlay = () => {
    dispatch(play())
  }

  const onClickToSelectTrack = (track) => {
    dispatch(selectTrack({ videoId: track.videoId }))
  }

  useEffect(() => {
    const getMoreContent = async () => {
      if (shouldFetchMoreContent) {
        await getRandom()
        dispatch(finishedLoadingContent())
      }
    }
    getMoreContent();
  }, [shouldFetchMoreContent]);

  useEffect(() => {
    getRandom()
  }, [])

  return (
      <div style={{
        margin: 0,
        padding: '1em',
        backgroundColor: '#272822',
        color: '#FFFFFF',
        height: '100%'
      }}>
        <h4>Choose a subreddit:</h4>
        <div style={{ marginBottom: '1em' }}>
          <label className="me-1" for="subName">r/ </label>
          <input
            type="text"
            id="subName"
            placeholder="synthwave"
            value={subName}
            onChange={e => setSubName(e.target.value)}
          />
          <div className="mt-2">
            <button className="btn btn-secondary me-1" onClick={getNewest}>Newest</button>
            <button className="btn btn-secondary" onClick={getRandom}>Random</button>
          </div>
        </div>
        { videoId && videoId.length > 0 && 
          <div style={{maxWidth: '660px'}} className="mt-3">
            <YouTube
              videoId={videoId}
              opts={{
                width: "100%",
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
        <div style={{display: 'flex', flexDirection: 'column', marginTop: "2em"}}>
          {tracks &&
            tracks.map((post, index) => {
              return (
                <span
                  key={post.id}
                  style={{
                    padding: '1em 1em 1em 1.5em',
                    margin: '-0.5em -1em 0',
                    backgroundColor: index === trackSelected ? "rgb(83, 174, 98)" : "inherit"
                  }}
                  className={`d-flex align-items-center justify-content-between ${index === trackSelected ? "text-dark" : "text-light"}`}
                >
                  <div class="d-flex align-items-center">
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
      </div>
  );
};

export default Player;

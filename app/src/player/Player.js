
import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import { useSelector, useDispatch  } from 'react-redux'

import { getValidPosts, getRedditNewest, getRedditRandom } from '../helpers';
import { loadTracks, replaceTracks, next, previous, play, } from './playerSlice'

const Player = () => {
//  const [state, dispatch] = useReducer(playerReducer, initialState)
  const [subName, setSubName] = useState('musicanova')

  const tracks = useSelector(state => state.player.tracks)
  const trackSelected = useSelector(state => state.player.trackSelected)
  const videoId = useSelector(state => state.player.videoId)
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

    dispatch(replaceTracks(validPosts))

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

    dispatch(replaceTracks(validPosts));
  };

  const onPlay = () => {
    dispatch(play())
  }

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
        <h3>Choose a subreddit:</h3>
        <div style={{ marginBottom: '1em' }}>
          <label for="subName">subreddit name r/</label>
          <input
            type="text"
            id="subName"
            placeholder="synthwave"
            value={subName}
            onChange={e => setSubName(e.target.value)}
          />
          <button onClick={getNewest}>Get newest videos from sub</button>
          <button onClick={getRandom}>Get random videos from sub</button>
        </div>
        { videoId && videoId.length > 0 && 
          <div style={{maxWidth: '660px'}}>
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
          <button onClick={goBack}>Previous</button>
          <button onClick={goNext}>Next</button>
        </div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          {tracks &&
            tracks.map((post, index) => {
              return (
                <span
                  key={post.id}
                  style={{
                    padding: '0.5em',
                    backgroundColor: index === trackSelected ? "#484d5b" : "inherit"
                  }}
                >
                  {`${post.title} - score ${post.score} - comments ${post.num_comments} - `}
                  <a href={`https://reddit.com${post.permalink}`} target="_blank">
                    Link
                  </a>
                </span>
              );
            })}
        </div>
      </div>
  );
};

export default Player;

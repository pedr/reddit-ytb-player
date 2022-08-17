
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch  } from 'react-redux'

import { getValidPosts, getRedditNewest, getRedditRandom } from '../helpers';
import { loadTracks, finishedLoadingContent, cleanTracks } from './playerSlice'

import PlaylistSelector from './PlaylistSelector'
import Playlist from './Playlist'
import YoutubePlayer from './YoutubePlayer'
import './Player.css'

const Player = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const shouldFetchMoreContent = useSelector(state => state.player.shouldFetchMoreContent)
  const fetchSongsMode = useSelector(state => state.player.fetchSongsMode)
  const playListSource = useSelector(state => state.player.playListSource)
  const dispatch = useDispatch()
  
  const getNewest = async () => {
    const response = await getRedditNewest(playListSource.code);

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

  const getRandom = async () => {
    let validPosts = [];
    let tries = 0;

    while (validPosts.length < 5 && tries < 10) {
      tries += 1;
      const response = await getRedditRandom(playListSource.code);

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

  useEffect(() => {
    const getMoreContent = async () => {
      if (!playListSource.code) {
        return false
      }

      if (shouldFetchMoreContent) {
        if (fetchSongsMode == "random") {
          await getRandom()
        } else if (fetchSongsMode == "new") {
          await getNewest()
        }
        dispatch(finishedLoadingContent())
      }
    }
    getMoreContent();
  }, [shouldFetchMoreContent]);

  useEffect(() => {
    const getMoreContent = async () => {
      dispatch(cleanTracks())
      if (fetchSongsMode == "random") {
        await getRandom()
      } else if (fetchSongsMode == "new") {
        await getNewest()
      }
      dispatch(finishedLoadingContent())
    }
    getMoreContent();
  }, [playListSource])

  return (
      <div id="player-wrapper">
        <PlaylistSelector  />
        <div style={{gridArea: 'videoplaylist'}}>
          <YoutubePlayer />
          <Playlist />
        </div>
      </div>
  );
};

export default Player;

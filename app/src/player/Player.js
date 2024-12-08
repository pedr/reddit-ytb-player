
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'

import { getValidPosts, getRedditNewest, getRedditTopOfTheWeek, getRedditTopOfTheMonth } from '../helpers';
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

  const getTop = async () => {
    let validPosts = [];
    const response = await getRedditTopOfTheWeek(playListSource.code);

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

    validPosts = [...getValidPosts(posts)];

    if (validPosts.length <= 5) {
      const response = await getRedditTopOfTheMonth(playListSource.code);

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
      validPosts = [...getValidPosts(posts)];
    }

    dispatch(loadTracks(validPosts));
  };

  useEffect(() => {
    const getMoreContent = async () => {
      if (!playListSource.code) {
        return false
      }

      if (shouldFetchMoreContent) {
        if (fetchSongsMode == "topOfTheWeek") {
          await getTop()
        } else if (fetchSongsMode == "new") {
          await getNewest()
        } else {
          throw new Error('mode not found: ', fetchSongsMode)
        }
        dispatch(finishedLoadingContent())
      }
    }
    getMoreContent();
  }, [shouldFetchMoreContent]);

  useEffect(() => {
    const getMoreContent = async () => {
      dispatch(cleanTracks())
      if (fetchSongsMode == "topOfTheWeek") {
        await getTop()
      } else if (fetchSongsMode == "new") {
        await getNewest()
      }
      dispatch(finishedLoadingContent())
    }
    getMoreContent();
  }, [playListSource])

  return (
    <div id="player-wrapper" style={{ gridArea: 'videoplaylist' }}>
      <PlaylistSelector />
      <YoutubePlayer />
      <Playlist />
    </div>
  );
};

export default Player;

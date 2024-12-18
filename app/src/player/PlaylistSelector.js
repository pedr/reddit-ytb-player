import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import './PlaylistSelector.css'
import { changeMode, changeSubSelection } from './playerSlice'

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

const PlaylistSelectorWrapper = () => {

  const { width } = useWindowDimensions();

  return (width > 920) ? <PlaylistSelector mobile={false} /> : <PlaylistSelectorMobile />
}

const PlaylistSelectorMobile = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return <>
    <button style={{ gridArea: 'sidemenu' }} className="btn btn-primary" onClick={() => setIsMenuOpen(val => !val)}>Subreddit selection</button>
    {
      isMenuOpen &&
      <PlaylistSelector mobile closeSelection={() => setIsMenuOpen(false)} />
    }
  </>
}

const PlaylistSelector = ({ mobile, closeSelection }) => {
  const subSelected = useSelector(state => state.player.playListSource.code)
  const [subName, setSubName] = useState(subSelected);

  const fetchSongsMode = useSelector(state => state.player.fetchSongsMode)
  const dispatch = useDispatch()

  const changePlaylist = (title, code, fetchSongsMode) => {
    if (mobile) {
      closeSelection()
    }
    dispatch(changeSubSelection({ title, code, fetchSongsMode }))
  }

  const updateSubSelectionFromUserInput = () => {
    if (mobile) {
      closeSelection()
    }
    dispatch(changeSubSelection({ title: `/r/${subName}`, code: subName, fetchSongsMode }))
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const subredditCode =  params.get('sub') || 'musicanova'
    dispatch(changeSubSelection({ title: `/r/${subredditCode}`, code: subredditCode, fetchSongsMode }))
  }, [])

  useEffect(() => {
    setSubName(subSelected)
  }, [subSelected])

  return <div className={mobile ? "playlist-selector-mobile mt-5" : ""} style={{gridArea: 'sidemenu', zIndex: 9999}}>
    <h4>Choose a subreddit by name, or from the suggestion list:</h4>
    <div style={{ marginBottom: '1em' }}>
      <div className="d-flex align-center">
        <label className="me-1 align-self-center" htmlFor="subName">r/ </label>
        <input
          type="text"
          id="subName"
          placeholder="synthwave"
          value={subName}
          onChange={e => setSubName(e.target.value)}
        />
        <button className="ms-1 px-3 btn btn-primary btn-sm" onClick={updateSubSelectionFromUserInput}>Go</button>
      </div>
      <div className="mt-2 d-flex">
        <span className="me-2 ">Select songs: </span>
        <div className="form-check me-3">
          <input
            className="form-check-input"
            type="radio"
            onChange={() => dispatch(changeMode("new"))}
            checked={fetchSongsMode == "new"}
            id="fetchNew"
          />
          <label className="form-check-label" htmlFor="fetchNew">
            Newest
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            onChange={() => dispatch(changeMode("topOfTheWeek"))}
            checked={fetchSongsMode == "topOfTheWeek"}
            id="topOfTheWeek"
          />
          <label className="form-check-label" htmlFor="topOfTheWeek">
            Top week/month
          </label>
        </div>
      </div>
    </div>
    <div className="playlist-selection-wrapper">
      {options.map(opt => <PlayListOption key={opt.code} {...opt} onClickSelection={() => changePlaylist(opt.title, opt.code, fetchSongsMode)} />)}
    </div>
  </div>
}

const PlayListOption = ({ title, subtitle, onClickSelection }) => {
  return (
    <div className="d-flex justify-content space-between align-itens p-2 mb-2 bg-dark bg-gradient rounded playlist-selection-wrapper" onClick={onClickSelection}>
      <div className="flex-grow-1">
        <h5>{title}</h5>
        <p className="text-muted">{subtitle}</p>
      </div>
      <div className="d-flex ml-3">
        <div className="align-self-center border rounded-circle border-3 border-warning" style={{ height: 72, width: 72 }}>
          <i className="bi bi-headphones text-warning" style={{ fontSize: '3em', verticalAlign: 'middle', marginLeft: 9, marginBottom: 8 }} />
        </div>
      </div>
    </div>
  )
}

const options = [
  {
    title: '/r/musicanova',
    subtitle: 'Music from upcoming and indie brazilian musicians',
    code: 'musicanova'
  },
  {
    title: '/r/dreampop',
    subtitle: 'Dream pop music',
    code: 'dreampop'
  },
  {
    title: '/r/witch_house',
    subtitle: 'WΣ CØMΣ FRØM Δ ÐARK ΔBYSS, WΣ ΣNÐ ‡N Δ ÐARK ΔBYSS, ΔNÐ WΣ CΔLL THΣ ŁUM‡NØUS ‡NTΣRVAL Ł‡FΣ',
    code: 'witch_house'
  },
  {
    title: '/r/synthwave',
    subtitle: 'Electronic music of the Cold War continued',
    code: 'synthwave'
  },
  {
    title: '/r/mealtimevideos',
    subtitle: 'You know when you sit down for a meal in front of the computer and you just need something new to watch for a bit while you eat?',
    code: 'mealtimevideos'
  },
  {
    title: '/r/youtubehaiku',
    subtitle: 'Poetic and/or funny YouTube videos under 30 seconds. ',
    code: 'youtubehaiku'
  }
]

export default PlaylistSelectorWrapper

import React from 'react'
import { fireEvent, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import YoutubePlayer, { testId } from '../YoutubePlayer'
import { renderWithProviders } from '../../../config/test-utils'
import { play } from '../playerSlice'

const mockYoutube = jest.fn();
jest.mock('react-youtube', () => props => {
  mockYoutube(props)
  return <mock-youtube />
})

it('first test', async () => {
  renderWithProviders(<YoutubePlayer />, { preloadedState: {}})

  expect(screen.getByText('Playing'))
  expect(screen.getByText('Next'))
  expect(screen.getByText('Previous'))
})

it('should show title of subreddit if present', async () => {
  const MOCK_TITLE = '/r/mock-subreddit-title'
  const preloadedState = {
    player: {
      playListSource: {
        title: MOCK_TITLE
      }
    }
  }
  renderWithProviders(<YoutubePlayer />, { preloadedState })

  expect(screen.getByText(MOCK_TITLE))
  const titleTextElement = screen.getByText('Playing', { exact: false})
  expect(titleTextElement.textContent).toEqual(`Playing ${MOCK_TITLE}`)
})

it('should show Youtube component wrapper if videoId is not a empty string', async () => {
  const MOCK_VIDEOID = 'mock-videoId'
  const preloadedState = {
    player: {
      videoId: MOCK_VIDEOID,
      playListSource: {}
    }
  }
  renderWithProviders(<YoutubePlayer />, { preloadedState })

  expect(screen.getByTestId(testId.youtubeComponentWrapper))
})

it('should update videoId being sent to Youtube component after user clicks Next', async () => {
  const preloadedState = {
    player: {
      tracks: [
        {
          id: 'id-0',
          url: 'url-0',
          title: 'title-0',
          score: 0,
          permalink: 'permalink-0',
          num_comments: 0,
          videoId: 'videoId-0'
        },
        {
          id: 'id-1',
          url: 'url-1',
          title: 'title-1',
          score: 1,
          permalink: 'permalink-1',
          num_comments: 1,
          videoId: 'videoId-1' 
        },
      ],
      trackSelected: 0,
      videoId: 'videoId-0',
      playListSource: {}
    }
  }
  renderWithProviders(<YoutubePlayer />, { preloadedState })

  expect(mockYoutube).toHaveBeenCalledWith(
    expect.objectContaining({
      videoId: preloadedState.player.tracks[0].videoId
    })
  )

  fireEvent.click(screen.getByText('Next'))

  expect(mockYoutube).toHaveBeenCalledWith(
    expect.objectContaining({
      videoId: preloadedState.player.tracks[1].videoId
    })
  )
})
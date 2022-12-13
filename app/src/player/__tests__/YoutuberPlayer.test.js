
import React from 'react'
import {render, fireEvent, waitFor, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import YoutubePlayer from '../YoutubePlayer'
import { renderWithProviders } from '../../../config/test-utils'

it('first test', async () => {
  renderWithProviders(<YoutubePlayer />, { preloadedState: {}})

  expect(screen.getByText('Playing'))
})
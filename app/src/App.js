import React from "react";
import { Provider } from 'react-redux'
import Player from './player/Player'

import { store } from './store'

const App = () => {
  return (
    <Provider store={store}>
      <Player></Player>
    </Provider>
  );
};

export default App;

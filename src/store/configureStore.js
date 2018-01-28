import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducers'
import { composeWithDevTools } from 'redux-devtools-extension'

import Player from '../services/Player';
const player = new Player();


function playerMiddleware () {
  return store => next => action => {
    if (action.type === 'PLAY') {
      const {intro, sections, ending, settings } = store.getState();
      player.start([intro, ...sections, ending],{ tempo: settings.tempo, swing: settings.swing, key:settings.key});
      player.onFinishPlaying(() => {
        store.dispatch({type:'PLAY_ENDED'})
      })
    } else if (action.type === 'STOP') {  
      player.stop();
    }
    return next(action); 
  }
}

export default function configureStore(initialState) {
  const store =  createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(playerMiddleware())))

  player.loadSamples(() => store.dispatch({type:'SAMPLES_LOADED'}));

  return store;
}
import player from './player'
import settings from './settings'
import intro from './intro'
import ending from './ending'
import sections from './sections'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
    player,
    settings,
    intro,
    ending,
    sections
})

export default rootReducer
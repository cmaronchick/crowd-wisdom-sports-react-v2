import { createStore, combineReducers, applyMiddleware, compose} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk'

import userReducer from './reducers/userReducer'
import sportReducer from './reducers/sportReducer'
import gamesReducer from './reducers/gamesReducer'
import leaderboardReducer from './reducers/leaderboardReducer'
import crowdReducer from './reducers/crowdReducer'
import uiReducer from './reducers/uiReducer'

const initialState = {};

const middleware = [thunk];

const reducers = combineReducers({
    user: userReducer,
    games: gamesReducer,
    sport: sportReducer,
    leaderboards: leaderboardReducer,
    crowds: crowdReducer,
    UI: uiReducer
})
// console.log('window.__REDUX_DEVTOOLS_EXTENSION__', window.__REDUX_DEVTOOLS_EXTENSION__)
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() || compose
const store = createStore(reducers, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ ? compose(applyMiddleware(...middleware), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({trace: true, traceLimit: 25})) : compose(applyMiddleware(...middleware)))

export default store
import React, { Component } from 'react';
import {Auth} from '@aws-amplify/auth'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Layout } from 'antd';
import logo from './images/stake-image.svg';
import './App.less';
import Header from './components/layout/header/Header'
import SideMenu from './components/layout/sidemenu/SideMenu'
import Authenticate from './components/profile/Authenticate'
import GamesList from './components/gamesList/GamesList'
import Game from './components/game/Game'
import Leaderboards from './components/leaderboards/Leaderboards'

import { getUrlParameters } from './functions/utils'

// redux stuff
import store from './redux/store'
import { LOADING_USER, SET_USER, LOADING_GAMES, LOADING_GAME } from './redux/types'
import { setSport, setGameWeek } from './redux/actions/sportActions'
import { fetchGame } from './redux/actions/gamesActions'

import { getFacebookUser } from './redux/actions/userActions'


const { Footer, Content } = Layout;
var stateKey = 'amplify_auth_state';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sport: 'nfl',
      games: {},
      gameWeek: 1,
      season: 'reg',
      year: 2019
    }
  }
  

  handleAmplifyCallback = async (location) => {
    // firebase.analytics().logEvent('login', { step: 2, name: 'spotifyCallback' })
    store.dispatch({
      type: LOADING_USER
    })
    let state = getUrlParameters(location.href, 'state')
    let storedState = localStorage[stateKey];
    console.log('state, storedState', state, storedState)
    if (state === null || storedState !== state) {
      return { error: 'state_mismatch'}
    }
    store.dispatch(getFacebookUser(location, this.props.history));
  }

  async componentDidMount() {
    store.dispatch({
      type: LOADING_USER
    })
    store.dispatch({
      type: LOADING_GAMES
    })
    store.dispatch({
      type: LOADING_GAME
    })
    try {
      const currentUser = await Auth.currentAuthenticatedUser()
      store.dispatch({
        type: SET_USER,
        payload: {
          ...currentUser.attributes
        }
      })
    } catch (getCurrentUserError) {
      console.log('getCurrentUserError', getCurrentUserError)
    }
    store.dispatch(setSport('nfl'))
    if (window.location.pathname === '/callback') {
      console.log('starting spotify login', window.location)
      this.handleAmplifyCallback(window.location)
    }
  }
  render() {
    return (
      <div className="App">
        <Layout>
        <Header />
        <Content>
          <Layout hasSider={true}>
            <Router>
            <SideMenu />
            <Content>
            <Authenticate />
                <Switch>
                  <Route path="/:sport/games/:year/:season/:gameWeek/:gameId" render={({match}) => 
                    <Game
                    sport={match.params.sport}
                    year={parseInt(match.params.year)}
                    season={match.params.season}
                    gameWeek={match.params.gameWeek}
                    gameId={match.params.gameId} />
                  }/>
                  <Route path="/:sport/leaderboards">
                    <Leaderboards />
                  </Route>
                  <Route path="/">
                    <GamesList />
                  </Route>
                </Switch>
            </Content>
            </Router>
          </Layout>
        </Content>
        </Layout>
      </div>
    );
  }
}

export default App;

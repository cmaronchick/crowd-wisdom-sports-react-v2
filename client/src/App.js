import React, { Component } from 'react';
import {Auth} from '@aws-amplify/auth'
import logo from './images/stake-image.svg';
import './App.css';
import Header from './components/header/Header'
import Authenticate from './components/profile/Authenticate'
import GamesList from './components/gamesList/GamesList'

import { getUrlParameters } from './functions/utils'

// redux stuff
import store from './redux/store'
import { LOADING_USER, SET_USER } from './redux/types'
import { setGameWeek } from './redux/actions/sportActions'

import { getFacebookUser } from './redux/actions/userActions'

var stateKey = 'amplify_auth_state';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sport: 'nfl',
      games: {},
      gameWeek: 1,
      season: 'reg',
      year: 2020
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
    store.dispatch(setGameWeek('nfl'))
    if (window.location.pathname === '/callback') {
      console.log('starting spotify login', window.location)
      this.handleAmplifyCallback(window.location)
    }
  }
  render() {
    return (
      <div className="App">
        <Header />
        <Authenticate />
        <GamesList />
      </div>
    );
  }
}

export default App;

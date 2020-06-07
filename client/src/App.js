import React, { Component } from 'react';
import {Auth} from '@aws-amplify/auth'
import { Router, Switch, Route } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { Layout } from 'antd';
import logo from './images/stake-image.svg';
import './App.less';
import Header from './components/layout/header/Header'
import SideMenu from './components/layout/sidemenu/SideMenu'
import LoginModal from './components/profile/LoginModal'
import GamesList from './components/gamesList/GamesList'
import Game from './components/game/Game'
import Leaderboards from './components/leaderboards/Leaderboards'
import Groups from './components/groups/Groups'
import Group from './components/groups/Group'
import Profile from './components/profile/Profile'

import { getUrlParameters } from './functions/utils'

// redux stuff
import store from './redux/store'
import { LOADING_USER, SET_USER, LOADING_GAMES, LOADING_GAME, LOADING_LEADERBOARDS } from './redux/types'
import { setSport, setGameWeek } from './redux/actions/sportActions'
import { fetchGame } from './redux/actions/gamesActions'
import { fetchLeaderboards } from './redux/actions/leaderboardActions'

import { getFacebookUser } from './redux/actions/userActions'



const customHistory = createBrowserHistory();
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
    // store.dispatch({
    //   type: LOADING_LEADERBOARDS
    // })
    try {
      const currentUser = await Auth.currentAuthenticatedUser()
      console.log('currentUser', currentUser)
      store.dispatch({
        type: SET_USER,
        payload: {
          username: currentUser.username,
          attributes: currentUser.attributes
        }
      })
    } catch (getCurrentUserError) {
      console.log('getCurrentUserError', getCurrentUserError)
    }
    //check pathname for sports variables
    if (this.props.location.pathname) {
      let routeParams = this.props.location.pathname.split('/')
      let sport = routeParams[1]
      let page = routeParams[2]
      let year = parseInt(routeParams[3])
      let season = routeParams[4]
      let week = parseInt(routeParams[5])
      store.dispatch(setSport(sport ? sport : 'nfl', year, season, week))
      // if (page === 'leaderboards') {
      //   store.dispatch(fetchLeaderboards(sport ? sport : 'nfl', year ? year : 2019, season ? season : 'post', week ? week : 4))
      // }
    }
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
            <SideMenu />
            <Content>
            {/* <ProfileSnippet /> */}
                <Switch>
                  <Route path="/profile" component={Profile} />
                  <Route path="/:sport/games/:year/:season/:gameWeek/game/:gameId" component={Game} />
                  <Route path="/:sport/leaderboards" component={Leaderboards} />
                  <Route path="/:sport/groups/:year/:season/group/:groupId" component={Group} />
                  <Route path="/:sport/groups" component={Groups} />
                  <Route path={["/:sport", "/:sport/games","/"]} component={GamesList} />
                </Switch>
            </Content>
          </Layout>
        </Content>
        </Layout>
        <LoginModal />
      </div>
    );
  }
}

export default App;

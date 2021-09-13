import React, { Component } from 'react';
import {Auth} from '@aws-amplify/auth'

import ReactGA from 'react-ga'
import { config as analytics } from './constants/analytics'


import { Router, Switch, Route, Redirect } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { Layout } from 'antd';

import { connect } from 'react-redux'
import './App.less';
import Header from './components/layout/header/Header'
import SideMenu from './components/layout/sidemenu/SideMenu'
import FooterComponent from './components/layout/Footer'
import LoginModal from './components/profile/LoginModal'
import Games from './components/games/Games'
import Game from './components/game/Game'
import OddsMovement from './components/oddsmovement/OddsMovement'
import Leaderboards from './components/leaderboards/Leaderboards'
import Groups from './components/groups/Groups'
import Group from './components/groups/Group'
import Profile from './components/profile/Profile'
import Rules from './components/static/Rules'
import About from './components/static/About'
import OddsChangeModal from './components/game/Game.OddsChangeModal'
import AdminPage from './components/admin/AdminPage';

import { getUrlParameters } from './functions/utils'

// redux stuff
import store from './redux/store'
import { LOADING_USER, SET_USER, LOADING_GAMES, LOADING_GAME } from './redux/types'
import { setSport } from './redux/actions/sportActions'
import { toggleOddsChangeModal } from './redux/actions/uiActions'

import { getFacebookUser, getUserDetails } from './redux/actions/userActions'

const { Footer, Content } = Layout;
var stateKey = 'amplify_auth_state';


const history = createBrowserHistory()
history.listen(location => {
    ReactGA.set({ page: location.pathname })
    ReactGA.pageview(location.pathname)
})

const RequireAuth = (props) => {
  console.log(`props`, props)
  if (!props.user.authenticated) {
    
    return <Redirect to="/" />
  }
  const Component = props.Component
  Auth.currentSession()
  .then(currentSession => {
    let tokenPayload = currentSession.getIdToken().decodePayload()
    console.log(`tokenPayload`, tokenPayload)
    if (currentSession && tokenPayload['cognito:groups'] && tokenPayload['cognito:groups'].indexOf('admins') > -1) {
      console.log('user is an admin')
      return <Component />
    } else {
      console.log('User is not an admin')
      return (<div></div>)
      // <Redirect to="/nfl/games" />
    }
  })
  .catch((currentSessionError) => {
    console.log(`currentSessionError`, currentSessionError)
    return <Redirect to="/nfl/games" />

  })
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sport: 'nfl',
      games: {},
      gameWeek: 1,
      season: 'reg',
      year: 2019,
      user: this.props.user
    }
  }

  

  handleAmplifyCallback = async (location) => {
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
    ReactGA.initialize(analytics.trackingId)
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
      const tokenPayload = await (await Auth.currentSession()).getIdToken().decodePayload()
      currentUser.attributes.isAdmin = tokenPayload && tokenPayload['cognito:groups'] && tokenPayload['cognito:groups'].indexOf('admins') > -1 ? true : false
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
      this.props.setSport(sport ? sport : 'nfl', year, season, week)
      // if (page === 'leaderboards') {
      //   store.dispatch(fetchLeaderboards(sport ? sport : 'nfl', year ? year : 2019, season ? season : 'post', week ? week : 4))
      // }
    }
    if (window.location.pathname === '/callback' && window.location.search.indexOf('error') === -1) {
      console.log('starting FB login', window.location)
      this.handleAmplifyCallback(window.location)
    }
  }
  render() {
    // console.log(`this.props.user.details?.isAdmin`, this.props.user.details?.isAdmin)
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
                  <Route path="/rules" component={Rules} />
                  <Route path="/about" component={About} />
                  <Route path="/:sport/games/:year/:season/:gameWeek/game/:gameId" component={Game} />
                  <Route path="/:sport/leaderboards" component={Leaderboards} />
                  <Route path="/:sport/groups/:year/:season/group/:groupId" component={Group} />
                  <Route path="/:sport/groups" component={Groups} />
                  <Route path="/:sport/oddsmovement/:year/:season/:gameWeek" component={OddsMovement} />
                  {/* <Route path="/:sport/games/admin" component={props => 
                    <RequireAuth {...props} user={this.props.user} Component={AdminPage} />}/> */}
                  <Route path="/:sport/games/admin" component={AdminPage}/>
                  <Route path={["/:sport", "/:sport/games","/"]} component={Games} />
                </Switch>
            </Content>
          </Layout>

          <OddsChangeModal
            oddsChangeModalShow={this.props.UI.oddsChangeModalOpen}
            toggleOddsChangeModal={this.props.toggleOddsChangeModal}
            oddsChangeModalDetails={this.props.UI.oddsChangeModalDetails} />
        </Content>
        <Footer>
          <FooterComponent />
        </Footer>
        </Layout>
        <LoginModal />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loadingGames: state.games.loadingGames,
  games: state.games.games,
  gamePredictions: state.games.gamePredictions,
  sport: state.sport,
  user: state.user,
  UI: state.UI
})


const mapActionsToProps = {
  getUserDetails,
  toggleOddsChangeModal,
  setSport
}

export default connect(mapStateToProps, mapActionsToProps)(App);

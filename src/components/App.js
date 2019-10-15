import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { createMemoryHistory } from 'history'
const history = createMemoryHistory()
import Auth from '@aws-amplify/auth';

import awsconfig from '../../awsexports'

// retrieve temporary AWS credentials and sign requests
Auth.configure(awsconfig);

import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import Header from './Header';
import GamesList from './GamesList';
import Game from './Game';
import Leaderboards from './Leaderboards'
import HomeLeaderboards from './Home.Leaderboards';
import CrowdOverallCompare from './Home.CrowdOverallCompare'
import LoginModal from './LoginModal';
import Weeks from './Weeks';
import Navigation from './Navigation'
import * as api from '../api';


import ReactGA from 'react-ga'
import * as analytics from '../constants/analytics'


const pushState = (obj, url) =>
  window.history.pushState(obj, '', url);

const onPopState = handler => {
  window.onpopstate = handler;
};

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...this.props.initialData,
      sport: (this.props.initialData && this.props.initialData.sport) ? this.props.initialData.sport : 'nfl',
      gamePredictions: {},
      fetchingData: false,
      fetchingSingleGame: false,
      fetchingLeaderboards: false,
      loginModalShow: false,
      confirmUser: false,
      authState: 'checkingSignIn'
    }
    
  }
  
  
  async componentDidMount() {
    console.log({stateOnMount: this.state});
    // timers, listeners
    onPopState((event) => {
      this.setState({
        currentGameId: (event.state || {}).currentGameId
      });
    });
    // console.log('this.state: ', this.state)

    let fbUser = this.state.code ? await api.getFacebookUser(this.state.code) : null
    ReactGA.initialize(analytics.config);
    try {
      let user = await Auth.currentAuthenticatedUser({bypassCache: true})
      this.setState({user, authState: 'signedIn'})
    } catch(userError) {
      this.setState({user: null, authState: 'signIn'})
    }

    console.log({currentGameId: this.state.currentGameId});

    if (!this.state.currentGameId) {
      try {
        this.setState({ fetchingGames: true })
        let userSession = await Auth.currentSession();
        let gameWeekDataResponse = await api.fetchGameWeek(this.state.sport, userSession)
        const { sport, year, week, season, weeks } = this.state ? this.state : gameWeekDataResponse.gameWeekData;
        ReactGA.pageview(`/${sport}/${year}/${season}/${week}`)
        let games = await api.fetchGameWeekGames(sport, year, season, week, userSession);
        let gamePredictions = {};
        Object.keys(games).forEach(gameKey => {
          gamePredictions[gameKey] = games[gameKey].prediction ? { predictionAwayTeamScore: games[gameKey].prediction.awayTeam.score, predictionHomeTeamScore: games[gameKey].prediction.homeTeam.score } : null
        })
          this.setState({
            userSession: userSession,
            sport: 'nfl',
            year: year,
            currentWeek: week,
            gameWeek: week,
            season: season,
            weeks: weeks,
            currentGameId: null,
            data: games,
            games: games,
            fetchingGames: false,
            gamePredictions
          });

        } catch (gameWeekDataError) {
          console.log('gameWeekDataError: ', gameWeekDataError)
        }
        try {
          let userSession = await Auth.currentSession();
          let gameWeekDataResponse = await api.fetchGameWeek(this.state.sport, userSession)
          const { sport, year, season } = this.state ? this.state : gameWeekDataResponse.gameWeekData;
          const week = this.state.gameWeek ? this.state.gameWeek : gameWeekDataResponse.gameWeekData.week;
          let crowdOverallData = await api.fetchCrowdOverall(sport, year, season, week)
          this.setState({
            crowd: crowdOverallData.crowd
          })
        } catch (crowdOverallDataError) {
          console.log({crowdOverallDataError})
        }

        try {
          let userSession = await Auth.currentSession()
          let userStatsResponse = userSession ? await api.getUserDetails(userSession, this.state.sport, this.state.year, this.state.season, this.state.week) : null
          console.log({userStatsResponse})
        } catch(userStatsResponseError) {
          console.log({userStatsResponseError})
        }
    }
  }
  
  shouldComponentUpdate(prevProps, prevState) {
    if (this.state.sport!==prevState.sport) return true;
    if (this.state.year!==prevState.year) return true;
    if (this.state.season!==prevState.season) return true;
    if (this.state.week!== prevState.week) return true;
    if (this.state.gamePredictions !== prevState.gamePredictions) return true;
    if (this.state.games!==prevState.games) return true;
    if (this.state.leaderboardData!==prevState.leaderboardData) return true;
    if (this.state.fetchingGames!==prevState.fetchingGames) return true;
    if (this.state.fetchingData!==prevState.fetchingData) return true;
    if (this.state.fetchingLeaderboards!==prevState.fetchingLeaderboards) return true;
    if (this.state.loginModalShow!==prevState.loginModalShow) return true;
    if (this.state.signingInUser!==prevState.signingInUser) return true;
    if (this.state.confirmUser!==prevState.confirmUser) return true;
    if (this.state.authState!==prevState.authState) return true;
    if (this.state.user!==prevState.user) return true;
    if (this.state.userStats!==prevState.userStats) return true;
    if (this.state.page!==prevState.page) return true;
    if (this.state.currentGameId!==prevState.currentGameId) return true;
    if (this.state.crowd!==prevState.crowd) return true;
    return false;
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.user!==prevState.user || this.state.week!== prevState.week || this.state.gameWeek!== prevState.gameWeek || this.state.sport !== prevState.sport) {

      let { sport, year, season, week } = this.state
      if (this.state.sport !== prevState.sport) {
        let userSession = await Auth.currentSession();
        let gameWeekDataResponse = await api.fetchGameWeek(this.state.sport, userSession)
        let { sport, year, season, week  } = gameWeekDataResponse.gameWeekData;
      }
      
      if (!this.state.currentGameId) {
        console.log(`/${sport}/${year}/${season}/${week}`);
        //ReactGA.pageview(`/${sport}/${year}/${season}/${week}`)
        this.fetchGameWeekGames(this.state.sport, this.state.year, this.state.season, this.state.gameWeek ? this.state.gameWeek : this.state.week)
        this.fetchLeaderboards(this.state.sport, this.state.year, this.state.season, this.state.gameWeek ? this.state.gameWeek : this.state.week) 
        this.fetchCrowdOverallCompare(sport, year, season, week)
          
      } else {
        ReactGA.pageview(`/${sport}/${year}/${season}/${week}/${this.state.currentGameId}`)
      }
    }
  }
  componentWillUnmount() {
    // clean timers, listeners
    onPopState(null);
  }

  selectSport = (e, sport) => {
    e.preventDefault();
    console.log({sport})
    this.setState({sport: sport})
  }

  confirmUser = async (e) => {
    e.preventDefault();
    const { confirmUserCode, username } = this.state;
    try {
      let confirmResponse = await Auth.confirmSignUp(username, confirmUserCode)
      console.log('confirmResponse: ', confirmResponse)
    } catch(confirmReject) {
      console.log('confirmReject: ', confirmReject)
    }
  }

  resendConfirmation = async (e) => {
    e.preventDefault();
    try {
      let resendSignUpResponse = await Auth.resendSignUp(this.state.username)
      console.log('resendSignUpResponse: ', resendSignUpResponse)
      this.setState({user, authState: 'signIn'})
    } catch(resendSignUpReject) {
      console.log('resendSignUpReject: ', resendSignUpReject)
    }
  }

  signIn = async (e) => {
     e.preventDefault()
    this.setState({signingInUser: true})
    const { username, password } = this.state;
    try {
      let user = await Auth.signIn(username, password)
    
      console.log('user: ', user)
      this.setState({user, signingInUser: false, authState: 'signedIn'})
      return user;
    } catch(signInError) {
      if (signInError.code === 'UserNotConfirmedException') {
        this.setState({ confirmUser: true, signingInUser: false })
        return;
      }
      this.setState({ signingInUser: false, signInError })
      console.log('signInError: ', signInError)
    }
  }
  signOut = async (e) => {
    e.preventDefault()
    console.log('signOut clicked')
    try{
      let signOutResponse = await Auth.signOut();
      this.setState({user: null, authState: 'signIn'})
    } catch(signOutError) {
      console.log('signOutError: ', signOutError)
    }
  }

  
    // Sign up user with AWS Amplify Auth
  signUp = async (e) => {
      e.preventDefault();
      const { username, password, givenName, familyName, email, emailOptIn } = this.state
      // rename variable to conform with Amplify Auth field phone attribute
      var attributes = {
        email: email,
        given_name: givenName,
        family_name: familyName
      }
      attributes['custom:reminderMailOptIn'] = emailOptIn ? '1' : '0'
      try {
        let signUpResponse = await Auth.signUp({
          username,
          password,
          attributes
        });
        this.setState({
            user: signUpResponse.user,
            confirmUser: true
        })
      } catch(err) {
        if (! err.message) {
            console.log('Error when signing up: ', err)
            // Alert.alert('Error when signing up: ', err)
        } else {
            console.log('Error when signing up: ', err, '; ', err.message)
            // Alert.alert('Error when signing up: ', err.message)
        }
      }
  }

  handleFBCode = () => {

  }

  handleLoginClick = () => {
    // return <LoginModal show={true} signInClick={this.signIn} signUpClick={this.signUp} />
    this.setState({ loginModalShow: true})
  }

  handleLoginModalClosed = () => {
    this.setState({ loginModalShow: false })
  }

  onChangeText = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  onYearChange = (year) => {
    const season = (parseInt(year) === 2017 || parseInt(year) === 2018) ? 'reg' : 'pre'
    this.setState({ fetchingGames: true })
    this.fetchGameWeekGames(this.state.sport, parseInt(year), season, 1)
  }
  
  onChangeGameScore = (gameId, event) => {
    console.log({gameId, value: event.target.value});
    const gamePredictions = this.state.gamePredictions
    const predictionValue = event.target.value.length === 0 ? '' : parseInt(event.target.value) ? parseInt(event.target.value) : ''
    gamePredictions[gameId] ? gamePredictions[gameId][event.target.name] = predictionValue : gamePredictions[gameId] = { [event.target.name]: predictionValue }
    this.setState({ 
      gamePredictions: { 
        ...gamePredictions 
      }
    })
    //console.log({gamePredictions: this.state.gamePredictions})
  }

  onChangeStarSpread = (gameId, event) => {
    const gamePredictions = this.state.gamePredictions
    gamePredictions[gameId] 
      ? gamePredictions[gameId].stars 
        ? gamePredictions[gameId].stars.spread = parseInt(event) 
      : gamePredictions[gameId].stars = { spread: parseInt(event), total: 0 }
    : gamePredictions[gameId] = { stars: { spread: parseInt(event)} }
    this.setState({ 
      gamePredictions: { 
        ...gamePredictions
      }
    })    
  }
  
  onChangeStarTotal = (gameId, event) => {
    const gamePredictions = this.state.gamePredictions
    gamePredictions[gameId] 
      ? gamePredictions[gameId].stars 
        ? gamePredictions[gameId].stars.total = parseInt(event) 
      : gamePredictions[gameId].stars = { total: parseInt(event), total: 0 }
    : gamePredictions[gameId] = { stars: { total: parseInt(event)} }
    this.setState({ 
      gamePredictions: { 
        ...gamePredictions
      }
    })    
  }

  submitPrediction = async (gameId) => {
    const game = this.state.games[gameId]

    try {
      let userSession = await Auth.currentSession();
      if (!userSession) {
        console.log('no user session')
        return { errorMessage: 'Please log in again and resubmit.' }
      }
      const { sport, year, season, gameWeek } = game;
      const gamePredictions = this.state.gamePredictions
      const gamePrediction = gamePredictions[gameId]
      gamePredictions[gameId].submittingPrediction = true;

      
      this.setState({
        gamePredictions: {
          ...gamePredictions
        }
      })
      if (gamePrediction || game.prediction) {

        const awayTeamScore = (gamePrediction && parseInt(gamePrediction.predictionAwayTeamScore)) ? parseInt(gamePrediction.predictionAwayTeamScore) : parseInt(game.prediction.awayTeam.score)
        const homeTeamScore = (gamePrediction && parseInt(gamePrediction.predictionHomeTeamScore)) ? parseInt(gamePrediction.predictionHomeTeamScore) : parseInt(game.prediction.homeTeam.score)
        const stars = {
          spread: (gamePrediction && gamePrediction.stars && gamePrediction.stars.spread) 
          ? gamePrediction.stars.spread 
            : (game.prediction && game.prediction.stars && game.prediction.stars.spread) 
            ? game.prediction.stars.spread 
          : 0,
          total: (gamePrediction && gamePrediction.stars && gamePrediction.stars.total) 
            ? gamePrediction.stars.total 
              : (game.prediction && game.prediction.stars && game.prediction.stars.total) 
            ? game.prediction.stars.total 
          : 0
        }
        var prediction = {
          gameId: game.gameId,
          gameWeek: game.gameWeek,
          year: game.year,
          sport: game.sport,
          season: game.season,
          awayTeam: {
            fullName: game.awayTeam.fullName,
            shortName: game.awayTeam.shortName,
            code: game.awayTeam.code,
            score: awayTeamScore ? awayTeamScore : game.prediction.awayTeam.score,
          },
          homeTeam: {
            fullName: game.homeTeam.fullName,
            shortName: game.homeTeam.shortName,
            code: game.homeTeam.code,
            score: homeTeamScore ? homeTeamScore : game.prediction.homeTeam.score,
          },
          stars: stars
        };
        let predictionResponse = await api.fetchSubmitPrediction(userSession, prediction);
        ReactGA.event({
          category: 'prediction',
          action: 'submitted',
          label: game.gameId,
          value: 'success'
        })
        let gameUpdate = predictionResponse.prediction.game;
        gameUpdate.prediction = predictionResponse.prediction.prediction;

        let games = this.state.games;
        let data = this.state.data;
        let gamePredictions = this.state.gamePredictions;
        games[game.gameId] = gameUpdate;
        data[game.gameId] = gameUpdate;

        if (gamePredictions[gameId]) {
          gamePredictions[gameId].predictionAwayTeamScore = prediction.awayTeam.score;
          gamePredictions[gameId].predictionHomeTeamScore = prediction.homeTeam.score;
        } else {
          gamePredictions[gameId] = {
            predictionAwayTeamScore: prediction.awayTeam.score,
            predictionHomeTeamScore: prediction.homeTeam.score,
          }
        }
        console.log('here')
        gamePredictions[gameId].submittingPrediction = false;
        this.setState({
          games: games,
          data: data,
          gamePredictions: {
            ...gamePredictions
          }
        })
        return predictionResponse;
      } else {
        return { predictionError: 'Please update your prediction.'}
      }      
    } catch(submitPredictionError) {
      console.log({submitPredictionError});
      ReactGA.event({
        category: 'prediction',
        action: 'submitted',
        label: game.gameId,
        value: 'failure'
      })
    }
  }

  fetchGameWeek = async () => {
    try {
      let userSession = await Auth.currentSession()
      let gameWeekData = await api.fetchGameWeek(this.state.sport, userSession)
      let games = await api.fetchGameWeekGames(gameWeekData.sport, gameWeekData.year, gameWeekData.week, userSession);
    } catch(gameWeekDataError) {
       console.log('gameWeekDataError: ', gameWeekDataError)
    }
  }

  fetchGame = async (sport, year, season, gameWeek, gameId) => {
    pushState(
      { currentGameId: gameId },
      `/${sport}/games/${year}/${season}/${gameWeek}/${gameId}`
    );
    this.setState({currentGameId: gameId, fetchingSingleGame: true})
    try {
      let userSession = await Auth.currentSession();
      let game = await api.fetchGame(sport, year, season, gameWeek, gameId, userSession)
      this.setState({
        pageHeader: gameId,
        currentGameId: gameId,
        data: {
          ...this.state.games,
          [game.gameId]: game,
          fetchingSingleGame: false
        }
      });
    } catch(fetchGameError) {
      console.log('App 115 fetchGameError: ', fetchGameError);
      this.setState({fetchingSingleGame: false})
    }
  }

  fetchGamesList = async (sport, year, season, week) => {
    pushState(
      {currentGameId: null},
      `/${sport}/games/${year}/${season}/${week}`
    );
    try {

      let userSession = await Auth.currentSession()
      let games = await api.fetchGamesList(sport, year, season, week, userSession)
        this.setState({
          currentGameId: null,
          data: {
            ...this.state.games,
            games
          }
        });
    } catch (fetchGamesListError) {
      console.log({fetchGamesListError})
    }
  }

  fetchGameWeekGames = async (sport, year, season, gameWeek) => {
    this.setState({ fetchingGames: true })
    pushState(
      {
        currentGameId: null,
        gameWeek: gameWeek,
        year: year
      },
      `/${sport}/games/${year}/${season}/${gameWeek}`
    );
    try {
      let userSession = await Auth.currentSession()
      let games = await api.fetchGameWeekGames(sport, year, season, gameWeek, userSession);
      let gamePredictions = {}
      Object.keys(games).forEach(gameKey => {
        gamePredictions[gameKey] = games[gameKey].prediction ? { predictionAwayTeamScore: games[gameKey].prediction.awayTeam.score, predictionHomeTeamScore: games[gameKey].prediction.homeTeam.score } : null
      })
    
      this.setState({
        year: year,
        gameWeek: gameWeek,
        currentGameId: null,
        data: games,
        games: games,
        gamePredictions,
        fetchingGames: false
      });
    } catch (getGamesError) {
      console.log({getGamesError});
      let games = await api.fetchGameWeekGames(sport, year, season, gameWeek);
      
      this.setState({
        year: year,
        gameWeek: gameWeek,
        currentGameId: null,
        data: games,
        games: games,
        fetchingGames: false
      });

    }
    try {
      let userSession = await Auth.currentSession()
      let userStatsResponse = await api.getUserDetails(userSession, sport, year, season, gameWeek);
      let userStats = userStatsResponse.userStatsResponse;
    
      this.setState({
        userStats
      });
    } catch (getGamesError) {
      console.log({getGamesError});
    }
  }

  fetchLeaderboards = async (sport, year, season, gameWeek) => {
    
    let week = gameWeek ? gameWeek : this.state.gameWeekData ? this.state.gameWeekData.week : null
    console.log({week});
    try {
      let userSession = await Auth.currentSession()
      let leaderboardData = await api.fetchOverallLeaderboard(userSession, sport, year, season, week)
      this.setState({ leaderboardData, fetchingLeaderboards: false })
    } catch(getUserSession) {
      let leaderboardData = await api.fetchOverallLeaderboard(null, sport, year, season, week)
      this.setState({ leaderboardData, fetchingLeaderboards: false })
    }
  }
  fetchCrowdOverallCompare = async (sport, year, season, week) => {
    try {
      let crowdOverallData = await api.fetchCrowdOverall(sport, year, season, week)
      this.setState({crowd: crowdOverallData.crowd})
    } catch (crowdOverallCompareError) {
      console.log({crowdOverallCompareError});
    }
  }

  currentGame(gameId) {
    return this.state.games ? this.state.games[gameId] : this.state.game;
  }
  pageHeader() {
    //console.log('this.state: ', this.state);
    if (this.state.currentGameId) {
      return this.currentGame().awayTeam.shortName + ' vs. ' + this.currentGame().homeTeam.shortName;
    }
    return !this.state.fetchingGames ? `Week ${this.state.gameWeek} Games` : 'Loading Games ...';
  }
  currentContent() {
    
      const { games, gamePredictions } = this.state;
      return (
          <Switch>
          <Route path="/:sport/games/:year/:season/:gameWeek/:gameId" render={({match}) => {
            const { gameId } = match.params;
            return (
              <Game 
              gamesListClick={this.fetchGamesList}
              onChangeGameScore={this.onChangeGameScore}
              onChangeStarSpread={this.onChangeStarSpread}
              onChangeStarTotal={this.onChangeStarTotal}
              onSubmitPrediction={this.submitPrediction}
              gamePrediction={this.state.gamePredictions[match.params.gameId]}
              {...this.currentGame(gameId)} />
              )
          }
          }/>
          <Route path="/:sport/leaderboards/:year/:season" render={() => 
            <Leaderboards leaderboardData={this.state.leaderboardData} />
          } />
          <Route path="/:sport" render={({match}) => {
            console.log({match})
            return (
              <div>
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Select a Season
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => this.onYearChange(2019)} href='#' className='yearDropdown'>2019</Dropdown.Item>
                    <Dropdown.Item onClick={() => this.onYearChange(2018)} href='#' className='yearDropdown'>2018</Dropdown.Item>
                    <Dropdown.Item onClick={() => this.onYearChange(2017)} href='#' className='yearDropdown'>2017</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                {/* <select onChange={(event) => this.onYearChange(event)} id="year" name="year">
                  <option value="2019">2019</option>
                  <option value="2018">2018</option>
                  <option value="2017">2017</option>
                </select> */}
                {this.state.weeks ? (
                  <Weeks
                  onGameWeekClick={this.fetchGameWeekGames} currentWeek={this.state.gameWeek} sport={this.state.sport} year={this.state.year} season={this.state.season}
                  weeks={this.state.weeks} />
                ) : null}
                {(this.state.crowd || this.state.userStats) ? (
                  <CrowdOverallCompare week={this.state.week} userStats={this.state.userStats} crowd={this.state.crowd} />
                ) : null}
                {this.state.games ? (
                <GamesList 
                  onChangeGameScore={this.onChangeGameScore}
                  onChangeStarSpread={this.onChangeStarSpread}
                  onChangeStarTotal={this.onChangeStarTotal}
                  onSubmitPrediction={this.submitPrediction}
                  onGameClick={this.fetchGame}
                  games={games} gamePredictions={gamePredictions} />
                ): (
                  <div>No games available</div>
                )}
                <HomeLeaderboards 
                  sport={this.state.sport}
                  year={this.state.year}
                  season={this.state.season}
                  week={this.state.week} />
              </div>
              )
            }} />
          </Switch>
    );
  }
  render() {
    return (
      /* <div id="sidebar">
        <h1 id="logo"><a href="/">STAKEHOUSE SPORTS</a></h1>
          <nav id="nav">
            <a href="/nfl" onClick={(e) => {
              console.log({e})
              e.preventDefault();
              this.selectSport(e, 'nfl')
            }}>NFL</a>
            <Button onClick={(e) => {
                      console.log({sport: this.state.sport})
                      this.selectSport(e, this.state.sport)
                    }}>Home</Button>
            <Button disabled={this.state.sport === 'nfl'} onClick={(e) => this.selectSport(e, 'nfl')}>NFL</Button>
            <Button onClick={(e) => this.selectSport(e, 'ncaaf')}>College Football</Button>
            <Button onClick={(e) => this.selectSport(e, 'ncaam')}>March Madness</Button>
          </nav>
      </div> */
      <div id="content">
        <div className="App inner">
        
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <div style={{flex: 1}}>
              <Button disabled={this.state.sport === 'nfl'} onClick={(e) => this.selectSport(e, 'nfl')}>NFL</Button>
            </div>
            <div style={{flex: 1}}>
              <Button onClick={(e) => this.selectSport(e, 'ncaaf')}>College Football</Button>
            </div>
            <div style={{flex: 1}}>
              <Button onClick={(e) => this.selectSport(e, 'ncaam')}>March Madness</Button>
            </div>
          </div>

        {/* <!-- Content --> */}
          {/* <div id="content">
            <div className="inner"> */}
            {(this.state.authState === 'signedIn') ? (
              <div className="row loginFields">
                {this.state.user.attributes.preferred_username}
                <Button onClick={this.signOut}>Logout</Button>
              </div>
            ) : (this.state.authState === 'signIn') ? (
              <div className="loginFields">
                {/* <form>
                  <label htmlFor='username'>
                    User Name:
                  </label>
                    <input type="text" name="username" key="username" onChange={this.onChangeText} />
                  <label htmlFor='password'>
                    Password:
                  </label>
                  <input type="password" name="password" key="password" onChange={this.onChangeText} />
                  
                  <Button onClick={() => this.signIn()}>Login</Button>
                </form> */}
                  <LoginModal 
                  onChangeText={this.onChangeText} 
                  show={this.state.loginModalShow} 
                  onHide={this.handleLoginModalClosed}
                  signingInUser={this.state.signingInUser}
                  signInError={this.state.signInError}
                  signInClick={this.signIn} 
                  signUpClick={this.signUp} 
                  confirmUser={this.state.confirmUser}
                  handleConfirmUserClick={this.confirmUser} 
                  handleResendClick={this.resendConfirmation}/>
                  
                  <Button onClick={() => this.handleLoginClick()}>Sign In/Sign Up</Button>
              </div>
            ) : null}
            <Header message={this.pageHeader()} />
            
            {this.state.fetchingGames ? (
              <Spinner animation='border' />
            ) : (
            this.currentContent()
            )}
          </div>

        </div>
    );
  }
}

// App.propTypes = {
//   initialGames: React.PropTypes.object
// };

export default App;

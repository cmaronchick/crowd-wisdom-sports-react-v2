import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { createMemoryHistory } from 'history'
const history = createMemoryHistory()
import Auth from '@aws-amplify/auth';
import * as utils from '../utils'
import awsconfig from '../awsexports'

// retrieve temporary AWS credentials and sign requests
Auth.configure(awsconfig);


import {Dropdown, Spinner} from 'antd'
import Header from './header/Header';
import GamesList from './gamesList/GamesList';
import Game from './Game';
import Leaderboards from './Leaderboards'
import Crowds from './Crowds'
import Crowd from './Crowd'
import HomeLeaderboards from './Home.Leaderboards';
import CrowdOverallCompare from './Home.CrowdOverallCompare'
import HomeStarResults from './Home.StarsResults'
import LoginModal from './profile/LoginModal';
import Weeks from './Weeks';
import Profile from './profile/Profile'
import * as api from '../apis';

// MUI Stuff
import withStyles from '@material-ui/core/styles/withStyles'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import themeFile from '../constants/theme'
import Button from '@material-ui/core/Button'

import ReactGA from 'react-ga'
import * as analytics from '../constants/analytics'
const pushState = (obj, url) =>
  window.history.pushState(obj, '', url);

const onPopState = handler => {
  window.onpopstate = handler;
};


const theme = createMuiTheme(themeFile)


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
      selectedLeaderboard: 'weekly',
      loginModalShow: false,
      confirmUser: false,
      compareTable: 'crowd',
      authState: 'checkingSignIn'
    }
    
  }
  
  
  async componentDidMount() {
    
    ReactGA.initialize(analytics.config);
    console.log({initialData: this.props.initialData.page});
    // timers, listeners
    onPopState((event) => {
      this.setState({
        currentGameId: (event.state || {}).currentGameId
      });
    });
    // console.log('this.state: ', this.state)
    let url = this.props.initialData ? this.props.initialData.url : null
    let fbUser = this.state.code ? await api.getFacebookUser(this.state.code, url) : null
    try {
      let user = await Auth.currentAuthenticatedUser({bypassCache: true})
      this.setState({user, authState: 'signedIn'})
    } catch(userError) {
      this.setState({user: null, authState: 'signIn'})
    }

    console.log({currentGameId: this.state.currentGameId});
    const { currentGameId, page, sport, year, season, week, query, user } = this.state;
    if (page === 'profile') {
      if (user) {
        this.setState({
          loginModalShow: true
        })
      }
    }
    if (!this.state.currentGameId && page !== 'crowds' && page !== 'profile' && page !== 'leaderboards') {
      try {
        let userSession = await Auth.currentSession();
        this.setState({ fetchingGames: true })
        let gameWeekDataResponse = await api.fetchGameWeek(this.state.sport, userSession)
        const { sport, year, week, season, weeks } = this.state ? this.state : gameWeekDataResponse.gameWeekData;
        console.log({weekApp90: week});
        ReactGA.pageview(`/${sport}/${year}/${season}/${week}`)
        let gamesData = await api.fetchGameWeekGames(sport, year, season, week, userSession, query && query.compareUsername ? query.compareUsername : null);
        const { games, gameResults } = gamesData
        let gamePredictions = {};
        Object.keys(games).forEach(gameKey => {
          gamePredictions[gameKey] = games[gameKey].prediction ? { predictionAwayTeamScore: games[gameKey].prediction.awayTeam.score, predictionHomeTeamScore: games[gameKey].prediction.homeTeam.score } : null
        })
          this.setState({
            userSession: userSession,
            sport: sport,
            year: year,
            currentWeek: week,
            gameWeek: week,
            season: season,
            weeks: weeks,
            currentGameId: null,
            data: games,
            games,
            gameResults,
            fetchingGames: false,
            gamePredictions
          });

        } catch (gameWeekDataError) {
          this.setState({ fetchingGames: true })
          try {
            let gameWeekDataResponse = await api.fetchGameWeek(this.state.sport, null)
            const { sport, year, week, season, weeks } = this.state ? this.state : gameWeekDataResponse.gameWeekData;
            console.log({weekApp116: week});
            ReactGA.pageview(`/${sport}/${year}/${season}/${week}`)
            let gamesData = await api.fetchGameWeekGames(sport, year, season, week, null);
            const { games, gameResults } = gamesData
            let gamePredictions = {};
            Object.keys(games).forEach(gameKey => {
              gamePredictions[gameKey] = games[gameKey].prediction ? { predictionAwayTeamScore: games[gameKey].prediction.awayTeam.score, predictionHomeTeamScore: games[gameKey].prediction.homeTeam.score } : null
            })
            this.setState({
              userSession: null,
              sport: sport,
              year: year,
              currentWeek: week,
              gameWeek: week,
              season: season,
              weeks: weeks,
              currentGameId: null,
              data: games,
              games,
              gameResults,
              fetchingGames: false,
              gamePredictions
            });
            console.log('gameWeekDataError: ', gameWeekDataError)
          } catch (fetchGameWeekErrorUnauth) {
            console.log({fetchGameWeekErrorUnauth});
          }
        }
        try {
          let gameWeekDataResponse = await api.fetchGameWeek(this.state.sport, null)
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
    if (page === 'crowds') {
      this.fetchCrowds(sport, year, season)
    }
    if (this.state.currentCrowdId) {

    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.user!==prevState.user || this.state.week!== prevState.week || this.state.gameWeek!== prevState.gameWeek || this.state.sport !== prevState.sport || this.state.query !== prevState.query) {

      let { sport, year, season, gameWeek, week, currentGameId, page, query } = this.state
      if (this.state.sport !== prevState.sport) {
        let userSession = await Auth.currentSession();
        let gameWeekDataResponse = await api.fetchGameWeek(this.state.sport, userSession)
        let { sport, year, season, week  } = gameWeekDataResponse.gameWeekData;
      }
      
      if (!this.state.currentGameId && page !== 'crowds' && page !== 'profile' && page !== 'leaderboards') {
        console.log(`/${sport}/${year}/${season}/${week}`);
        //ReactGA.pageview(`/${sport}/${year}/${season}/${week}`)
        this.fetchGameWeekGames(sport, year, season, gameWeek ? gameWeek : week, query && query.compareUsername ? query.compareUsername : null)
        this.fetchLeaderboards(sport, year, season, gameWeek ? gameWeek : week) 
        this.fetchCrowdOverallCompare(sport, year, season, gameWeek ? gameWeek : week)
          
      } else {
        ReactGA.pageview(`/${sport}/${year}/${season}/${week}/${this.state.currentGameId}`)
      }
      if (page === 'crowds') {
        this.fetchCrowds(sport, year, season)
      }
      if (page === 'leaderboards') {
        this.fetchLeaderboards(sport, year, season, week)
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
      let confirmUserResponse = await confirmUser(confirmUserCode, username)
      console.log('confirmUserResponse', confirmUserResponse)
      this.setState({
        confirmUser: false
      })
    } catch (confirmUserError) {
      console.log('confirmUserError', confirmUserError)
    }
  }

  signUp = async(e) => {
    e.preventDefault();
    const { username, password, givenName, familyName, email, emailOptIn } = this.state
    try{
      let signUpResponse = await utils.signUp(username, password, givenName, familyName, email, emailOptIn)
      console.log('signUpResponse: ', signUpResponse)
      this.setState({
          user: signUpResponse.user,
          confirmUser: true
      })
    } catch (signUpError) {
      console.log('signUpError: ', signUpError)
    }
  }

  signIn = async(e) => {
    e.preventDefault()
    this.setState({signingInUser: true})
    const { username, password } = this.state;
    try {
      let user = await utils.signIn(username, password)
      if (!user.error) {
        ReactGA.event({
          category: 'account',
          action: 'signin',
          label: 'complete',
          value: 'true'
        })
        this.setState({user, signingInUser: false, authState: 'signedIn'})
      } else {
        const signInError = user.error;
        if (signInError.code === 'UserNotConfirmedException') {
          
          ReactGA.event({
            category: 'account',
            action: 'signin',
            label: 'failed',
            value: signInError ? signInError.code : 0
          })
          this.setState({ confirmUser: true, signingInUser: false })
        } else {
          console.log('signInError', signInError)
          ReactGA.event({
            category: 'account',
            action: 'signin',
            label: 'failed',
            value: JSON.stringify(signInError)
          })
          this.setState({ signingInUser: false, signInError })
        }
      }
    } catch (signInError) {
      console.log('signInError ', signInError )
    }
  }

  signOut = async(e) => {
    
    e.preventDefault()
    console.log('signOut clicked')
    try {
      let signOutResponse = await utils.signOut();
      console.log('signOutResponse', signOutResponse)
      if (!signOutResponse.error) {
        ReactGA.event({
          category: 'account',
          action: 'signout',
          label: 'complete',
          value: 'true'
        })
        this.setState({user: null, authState: 'signIn'})
      } else {
        ReactGA.event({
          category: 'account',
          action: 'signout',
          label: 'failed',
          value: JSON.stringify(signOutError)
        })
      }
    } catch (signOutError) {
      console.log('signOutError', signOutError)
    }
  }

  resendConfirmation = async (e) => {
    e.preventDefault()
    try {
      let resendResponse = await utils.resendConfirmation()
      if (!resendResponse.error) {
        ReactGA.event({
          category: 'account',
          action: 'signup',
          label: 'resendConfirmation',
          value: 'true'
        })
      } else {
        ReactGA.event({
          category: 'account',
          action: 'signup',
          label: 'resendConfirmation',
          value: 'false'
        })        
      }
    } catch (resendConfirmationError) {
      ReactGA.event({
        category: 'account',
        action: 'signup',
        label: 'resendConfirmation',
        value: JSON.stringify(resendConfirmationError)
      })
    }
  }

  resetPassword = async (e) => {
    e.preventDefault();
    this.setState({sendingPasswordReset: true})
    try {
      let resetPasswordResponse = await utils.resetPassword()
      if (!resetPasswordResponse.error) {
        ReactGA.event({
          category: 'account',
          action: 'forgotpassword',
          label: 'complete',
          value: 'true'
        })
        this.setState({sendingPasswordReset: false,
        resetCodeSent: true})
      } else {
        ReactGA.event({
          category: 'account',
          action: 'forgotpassword',
          label: 'failed',
          value: JSON.stringify(resetPasswordResponse.error)
        })
      }
    } catch(resetPasswordError) {
      console.log({resetPasswordError})
    }
  }

  submitNewPassword = async(e) => {
    e.preventDefault();
    this.setState({sendingNewPassword: true})
    try {
      let submitNewPasswordResponse = await utils.submitNewPassword()
      if (!submitNewPasswordResponse.error) {
        ReactGA.event({
          category: 'account',
          action: 'submitnewpassword',
          label: 'complete',
          value: 'true'
        })
        this.setState({sendingPasswordReset: false,})
      } else {
        ReactGA.event({
          category: 'account',
          action: 'submitnewpassword',
          label: 'failed',
          value: JSON.stringify(submitNewPasswordResponse.error)
        })
      }
    } catch (submitNewPasswordError) {
      console.log({submitNewPasswordError})
    }
  }

  handleFBCode = () => {

  }

  handleLoginClick = () => {
    // return <LoginModal show={true} signInClick={this.signIn} signUpClick={this.signUp} />
        ReactGA.event({
          category: 'account',
          action: 'modal',
          label: 'open'
        })
    this.setState({ loginModalShow: true})
  }
  
  handleForgotPasswordClick = () => {
    this.setState({
      forgotPassword: true
    })
  }

  handleLoginModalClosed = () => {
    ReactGA.event({
      category: 'account',
      action: 'modal',
      label: 'close'
    })
    this.setState({
      loginModalShow: false,
      forgotPassword: false,
      resetCodeSent: false,
      sendingPasswordReset: false,
      newPassword: '',
      confirmUserCode: '',
      confirmUser: false
    })
  }

  handleCompareButtonClick = (compare) => {
    this.setState({ compareTable: compare })
  }

  handleSwitchLeaderboard = (selectedLeaderboard) => {
    this.setState({ selectedLeaderboard })
  }

  onChangeText = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }


  onYearChange = (year) => {
    const season = (parseInt(year) === 2017 || parseInt(year) === 2018) ? 'reg' : 'pre'
    this.setState({ fetchingGames: true })
    // omitting compare username when switching years - argument 5 is always null
    this.fetchGameWeekGames(this.state.sport, parseInt(year), season, 1, null)
  }

  onSeasonChange = (season) => {
    const { year, sport } = this.state
    this.setState({ fetchingGames: true })
    this.fetchGameWeekGames(sport, year, season, 1, null)
  }
  
  onChangeGameScore = (gameId, event) => {
    const gamePredictions = this.state.gamePredictions
    const predictionValue = event.target.value.length === 0 ? '' : (parseInt(event.target.value) || parseInt(event.target.value) === 0) ? parseInt(event.target.value) : ''
    
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
          odds: {
            spread: game.odds.spread,
            total: game.odds.total
          },
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
          label: game.gameId.toString()
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
        //console.log('here')
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
      const { query } = this.state
      let userSession = await Auth.currentSession()
      let gameWeekData = await api.fetchGameWeek(this.state.sport, userSession)
      let games = await api.fetchGameWeekGames(gameWeekData.sport, gameWeekData.year, gameWeekData.week, userSession, query && query.compareUsername ? query.compareUsername : null);
    } catch(gameWeekDataError) {
       console.log('gameWeekDataError: ', gameWeekDataError)
    }
  }

  fetchGamesCompareUser = async (sport, year, season, gameWeek, compareUsername) => {
    
    pushState(
      { query: {
        compareUsername
       }
      },
      `/${sport}/games/${year}/${season}/${gameWeek}?compareUsername=${compareUsername}`
    );
    this.setState({
      query: {
        compareUsername
      },
      fetchingSingleGame: true});
      
    try {
      let userSession = await Auth.currentSession();
      let game = await this.fetchGameWeekGames(sport, year, season, gameWeek, userSession)
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

  fetchGame = async (sport, year, season, gameWeek, gameId) => {
    console.log({sport, year, season, gameWeek, gameId});
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

  scrollToRef = (gameId) => window.scrollTo({
    top: document.getElementById(gameId).offsetTop
  })

  fetchGameWeekGames = async (sport, year, season, gameWeek, ref) => {
    this.setState({ fetchingGames: true })
    pushState(
      {
        currentGameId: null,
        gameWeek: gameWeek,
        year: year
      },
      `/${sport}/games/${year}/${season}/${gameWeek}${this.state.query && this.state.query.compareUsername ? `?compareUsername=${this.state.query.compareUsername}` : ''}`
    );
    try {
      const { query } = this.state
      let userSession = await Auth.currentSession()
      let gamesData = await api.fetchGameWeekGames(sport, year, season, gameWeek, userSession, query && query.compareUsername ? query.compareUsername : null);
      const { games, gameResults } = gamesData
      let gamePredictions = {}
      Object.keys(gamesData.games).forEach(gameKey => {
        gamePredictions[gameKey] = games[gameKey].prediction ? { predictionAwayTeamScore: games[gameKey].prediction.awayTeam.score, predictionHomeTeamScore: games[gameKey].prediction.homeTeam.score } : null
      })
    
      this.setState({
        year: year,
        gameWeek: gameWeek,
        currentGameId: null,
        data: games,
        games: games,
        gameResults,
        gamePredictions,
        fetchingGames: false
      });
    } catch (getGamesError) {
      console.log({getGamesError});
      let gamesData = await api.fetchGameWeekGames(sport, year, season, gameWeek, null);
      const { games, gameResults } = gamesData
      let gamePredictions = {}
      Object.keys(games).forEach(gameKey => {
        gamePredictions[gameKey] = games[gameKey].prediction ? { predictionAwayTeamScore: games[gameKey].prediction.awayTeam.score, predictionHomeTeamScore: games[gameKey].prediction.homeTeam.score } : null
      })

    
      this.setState({
        year: year,
        gameWeek: gameWeek,
        currentGameId: null,
        data: games,
        games,
        gameResults,
        gamePredictions,
        fetchingGames: false
      });
      (ref) ? this.scrollToRef(ref) : null
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
    console.log({sport, year, season, week});
    try {
      let userSession = await Auth.currentSession()
      let overallLeaderboardData = await api.fetchOverallLeaderboard(userSession ? userSession : null, sport, year, season, week);
      let weeklyLeaderboardData = await api.fetchWeeklyLeaderboard(userSession ? userSession : null, sport, year, season, week)
      // console.log(JSON.stringify(overallLeaderboardData));
      // console.log(JSON.stringify(weeklyLeaderboardData));
      this.setState({ overallLeaderboardData: overallLeaderboardData.leaderboardData, weeklyLeaderboardData: weeklyLeaderboardData.leaderboardData, fetchingLeaderboards: false })
    } catch(getUserSession) {
      let leaderboardData = await api.fetchOverallLeaderboard(null, sport, year, season, week)
      let overallLeaderboardData = await api.fetchOverallLeaderboard(null, sport, year, season, week);
      let weeklyLeaderboardData = await api.fetchWeeklyLeaderboard(null, sport, year, season, week)
      this.setState({ leaderboardData, overallLeaderboardData: overallLeaderboardData.leaderboardData, weeklyLeaderboardData: weeklyLeaderboardData.leaderboardData, fetchingLeaderboards: false })
    }
  }
  fetchCrowdOverallCompare = async (sport, year, season, week) => {
    try {
      console.log({ crowdOverallCompare: { sport, year, season, week }});
      let crowdOverallData = await api.fetchCrowdOverall(sport, year, season, week)
      this.setState({crowd: crowdOverallData.crowd})
    } catch (crowdOverallCompareError) {
      console.log({crowdOverallCompareError});
    }
  }

  fetchCrowds = async (sport, year, season) => {
    //gameweek is not necessary
    // call the getCrowds api endpoint
    // returns an array of crowds
    try {
      let crowdsData = await api.fetchCrowds(sport, year, season);
      console.log({crowdsData});
      this.setState({
        fetchingCrowds: false,
        crowds: crowdsData.crowds
      })
    } catch (fetchCrowdsError) {
      console.log({appJS635: fetchCrowdsError})
    }
  }

  fetchCrowd = async (sport, year, season, groupId) => {
    pushState(
      { currentCrowdId: groupId },
      `/${sport}/crowds/${year}/${season}/${groupId}`
    );
    this.setState({currentCrowdId: groupId, fetchingSingleCrowd: true})
    try {
      let userSession = await Auth.currentSession();
      let crowd = await api.fetchCrowd(sport, year, season, groupId, userSession)
      this.setState({
        pageHeader: crowd.groupName,
        currentCrowdId: groupId,
        crowds: {
          ...this.state.crowds,
          [crowd.groupId]: crowd,
          fetchingSingleCrowd: false
        }
      });
    } catch(fetchGameError) {
      console.log('App 115 fetchGameError: ', fetchGameError);
      this.setState({fetchingSingleGame: false})
    }
  }

  currentGame(gameId) {
    return this.state.games ? this.state.games[gameId] : this.state.game;
  }
  pageHeader() {
    //console.log('this.state: ', this.state);
    if (this.state.currentGameId) {
      return this.currentGame(this.state.currentGameId).awayTeam.shortName + ' vs. ' + this.currentGame(this.state.currentGameId).homeTeam.shortName;
    }
    return this.state.fetchingGames ? 'Loading Games ...' : this.state.gameWeek ? `Week ${this.state.gameWeek} Games` : (this.props.initialData && this.props.initialData.week) ? `Week ${this.props.initialData.week} Games` : ''
  }
  currentContent() {
      const { games, gamePredictions, gameResults, crowd, crowds, userStats, weeks, sport, season, year, user, loginModalShow } = this.state;
      return (
          <Switch>
            
          <Route path="/profile" render={({match}) => 
            this.state.user ? (
              <Profile user={user}
                onChangeText={this.onChangeText}
                handleSignInClick={this.signIn}
                loginModalShow={loginModalShow}
                changePassword={this.changePassword}
                newPassword={this.state.profileNewPassword}
                confirmPassword={this.state.profileConfirmPassword}
                passwordMatch={this.state.profilePasswordMatch} />
            ) : (
              <LoginModal 
              onChangeText={this.onChangeText} 
              show={true} 
              onHide={this.handleLoginModalClosed}
              signingInUser={this.state.signingInUser}
              signInError={this.state.signInError}
              signInClick={this.signIn} 
              signUpClick={this.signUp} 
              confirmUser={this.state.confirmUser}
              forgotPassword={this.state.forgotPassword}
              sendingNewPassword={this.state.sendingNewPassword}
              sendingPasswordReset={this.state.sendingPasswordReset}
              handleConfirmUserClick={this.confirmUser} 
              handleResendClick={this.resendConfirmation}
              handleForgotPasswordClick={this.handleForgotPasswordClick}
              resetCodeSent={this.state.resetCodeSent}
              resetPassword={this.resetPassword}
              submitNewPassword={this.submitNewPassword}
              />
            )
          } />
          <Route path="/:sport/games/:year/:season/:gameWeek/:gameId" render={({match}) => {
            const { gameId } = match.params;
            return (
              <div>
                <Header message={this.pageHeader()} />
                <Game 
                gamesListClick={this.fetchGameWeekGames}
                onChangeGameScore={this.onChangeGameScore}
                onChangeStarSpread={this.onChangeStarSpread}
                onChangeStarTotal={this.onChangeStarTotal}
                onSubmitPrediction={this.submitPrediction}
                onGameClick={this.fetchGame}
                gamePrediction={this.state.gamePredictions[match.params.gameId]}
                {...this.currentGame(gameId)} />
              </div>
              )
          }
          }/>
          <Route path={["/:sport/leaderboards", "/:sport/leaderboards/:year/:season"]} render={() => 
            <Leaderboards leaderboardDataObj={this.state.leaderboardData} />
          } />

          <Route path={["/:sport/crowds", "/:sport/crowds/:year", "/:sport/crowds/:year/:season"]} render={({match}) => {
            <Crowds crowds={this.state.crowds} {...match.params} />
          }}/>
          <Route path="/:sport/crowds/:year/:season/:crowdId" render={({match}) => 
            <Crowd crowd={this.state.crowd} {...match.params} />
          } />
          <Route path={["/", "/:sport"]} render={({match}) => {
            return (
              <div>
                {sport === 'ncaaf' ? (
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Select a Season
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                      {sport === 'nfl' ? (
                      <Dropdown.Item onClick={() => this.onSeasonChange('pre')} href='#' className='yearDropdown'>Pre</Dropdown.Item>
                      ) : null}
                      <Dropdown.Item onClick={() => this.onSeasonChange('reg')} href='#' className='yearDropdown'>Regular</Dropdown.Item>
                      <Dropdown.Item onClick={() => this.onSeasonChange('post')} href='#' className='yearDropdown'>Post</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                ) : null}
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
                {gameResults && gameResults > 0 && (crowd || (this.state.userStats && this.state.userStats.results)) ? (
                    (this.state.compareTable === 'crowd') ? (
                      <div className='compareDiv'>
                        {(this.state.userStats && this.state.userStats.results && this.state.userStats.results.weekly.stars && this.state.userStats.results.weekly.stars.wagered > 0) ? (
                          <Button onClick={() => this.handleCompareButtonClick('stars')}>
                            Show My Stars Results
                          </Button>
                        ) : (
                          <Button disabled={true}>
                            Wager Stars to See Your Stake Results
                          </Button>
                        )}
                        <CrowdOverallCompare selectedLeaderboard={this.state.selectedLeaderboard} week={this.state.week} userStats={this.state.userStats} crowd={this.state.crowd} />
                      </div>
                    ) : (
                      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <Button onClick={() => this.handleCompareButtonClick('crowd')}>
                          Show Me vs. the Crowd Results
                        </Button>
                        <HomeStarResults selectedLeaderboard={this.selectedLeaderboard} week={this.state.week} userStats={this.state.userStats} crowd={this.state.crowd} />
                      </div>
                    )
                ) : null}
                <div className='homeContent'>
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
                  {this.state.overallLeaderboardData && this.state.overallLeaderboardData.weekly && this.state.overallLeaderboardData.overall ? (
                  <HomeLeaderboards 
                    sport={this.state.sport}
                    year={this.state.year}
                    season={this.state.season}
                    week={this.state.week}
                    overallLeaderboardData={this.state.overallLeaderboardData}
                    weeklyLeaderboardData={this.state.weeklyLeaderboardData}
                    selectedLeaderboard={this.state.selectedLeaderboard}
                    handleSwitchLeaderboard={this.handleSwitchLeaderboard}
                    handleOnUserClick={this.fetchGamesCompareUser} />
                  ) : null}
                </div>
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
      <MuiThemeProvider theme={theme}>
        <div id="content">
          <div className="App inner">
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
                    forgotPassword={this.state.forgotPassword}
                    sendingNewPassword={this.state.sendingNewPassword}
                    sendingPasswordReset={this.state.sendingPasswordReset}
                    handleConfirmUserClick={this.confirmUser} 
                    handleResendClick={this.resendConfirmation}
                    handleForgotPasswordClick={this.handleForgotPasswordClick}
                    resetCodeSent={this.state.resetCodeSent}
                    resetPassword={this.resetPassword}
                    submitNewPassword={this.submitNewPassword}
                    />
                    
                    <Button variant="contained" color="primary" onClick={() => this.handleLoginClick()}>Sign In/Sign Up</Button>
                </div>
              ) : null}
              
              {this.state.fetchingGames ? (
                <Spinner animation='border' />
              ) : (
              this.currentContent()
              )}
            </div>

          </div>
      </MuiThemeProvider>
    );
  }
}

// App.propTypes = {
//   initialGames: React.PropTypes.object
// };

export default App;

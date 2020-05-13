import axios from 'axios';
import Auth from '@aws-amplify/auth'

import awsconfig from './awsexports'

// retrieve temporary AWS credentials and sign requests
Auth.configure(awsconfig);

import { 
  CognitoUser, 
  CognitoIdToken, 
  CognitoAccessToken, 
  CognitoRefreshToken, 
  CognitoUserSession, 
  CognitoUserPool } from 'amazon-cognito-identity-js'
import config from './awsexports'

const userPool = new CognitoUserPool({
  UserPoolId: config.aws_user_pools_id,
  ClientId: config.aws_user_pools_web_client_id,
  
});

const postOptions = (userSession, body) => {
  const callOptions = {
    headers: {
      Authorization: userSession.getIdToken().getJwtToken(),
      'Content-type': 'application/json'
    },
    body: JSON.stringify(body)
  }
  return callOptions;
}

const getOptions = (userSession) => {
  var anonString = '/anon'
  var callOptions = {}
  if (userSession) {
    callOptions = {
      headers: {
        Authorization: userSession.getIdToken().getJwtToken()
      }
    }
    anonString = ''
  }
  return { anonString, callOptions}
}

export const fetchGame = (sport, year, season, gameWeek, gameId, userSession, compareUsername) => {
  const getOptionsObj = getOptions(userSession);
  return axios.get(`/api/${sport}/games/${year}/${season}/${gameWeek}/${gameId}${compareUsername ? `?compareUsername=${compareUsername}` : ''}`, getOptionsObj.callOptions)
    .then(resp => resp.data);
};

export const fetchGamesList = (sport, year, season, week, userSession) => {
  console.log({userSession});
  const getOptionsObj = getOptions(userSession)
  return axios.get(`/api/${sport}/games/${year}/${season}/${week}`, getOptionsObj.callOptions)
  .then (resp => { return { games: resp.data.games, gameResults: resp.data.gameResults } });
};

// get the games for the default or chosen week
// if you are viewing 
export const fetchGameWeekGames = (sport, year, season, gameWeek, userSession, compareUsername) => {
  const getOptionsObj = getOptions(userSession)
  return axios.get(`/api/${sport}/games/${year}/${season}/${gameWeek}${compareUsername ? `?compareUsername=${compareUsername}` : ''}`, getOptionsObj.callOptions)
  .then (resp => { return { games: resp.data.games, gameResults: resp.data.gameResults } });
};

export const fetchGameWeek = (sport, userSession) => {
  const getOptionsObj = getOptions(userSession)
  return axios.get(`/api/${sport}/gameWeek`, getOptionsObj.callOptions)
  .then(resp => resp.data)
}

export const fetchSubmitPrediction = async (userSession, prediction) => {
  console.log({prediction})
  const postOptionsObj = postOptions(userSession, prediction)
  //console.log('postOptionsObj: ', postOptionsObj)
  let resp = await axios.post('/api/submitPrediction', postOptionsObj)
  console.log({resp})
  return resp.data
}

export const getUserSession = (callback) => {
  Auth.currentSession()
  .then(userSession => {
    console.log('userSession: ', userSession)
    return callback(userSession)
  })
  .catch(userSessionError => {
    console.log('userSessionError: ', userSessionError)
    return callback(false)
  })
}

export const getUserSessionAsync = async () => {
  let userSession = await Auth.currentSession()
  return userSession;
}

export const fetchOverallLeaderboard = (userSession, sport, year, season, week) => {
  console.log({overallLeaderboard: {sport, year, season, week}})
  if (userSession === "test") {
    return overallLeaderboardData
  }
  const getOptionsObj = getOptions(userSession)
  const sportValue = sport ? sport : 'nfl'
  return axios.get(`/api/${sportValue}/leaderboards/${year}/${season}/${week}`, getOptionsObj.callOptions)
  .then(resp => resp.data)
}



export const fetchWeeklyLeaderboard = (userSession, sport, year, season, week) => {
  console.log({weeklyLeaderboard: { sport, year, season, week}})
  const getOptionsObj = getOptions(userSession)
  const sportValue = sport ? sport : 'nfl'
  return axios.get(`/api/${sportValue}/leaderboards/${year}/${season}/${week}`, getOptionsObj.callOptions)
  .then(resp => resp.data)
}

export const fetchCrowdOverall = (sport, year, season, week) => {
  const sportValue = sport ? sport : 'nfl'
  return axios.get(`/api/${sportValue}/leaderboards/${year}/${season}/${week}/crowdOverall`)
  .then(resp => resp.data)
}

export const fetchCrowds = (sport, year, season) => {
  const sportValue = sport ? sport : 'nfl'
  return axios.get(`/api/${sportValue}/crowds/${year}/${season}`)
  .then(resp => resp.data)
  .catch(fetchCrowdsError => console.log({fetchCrowdsError}))
}

export const fetchCrowd = (sport, year, season, crowdId) => {
  return axios.get(`/api/${sportValue}/crowds/${year}/${season}/${crowdId}`)
  .then(resp => resp.data)
  .catch(fetchCrowdError => {
    console.log({fetchCrowdError})
      return {data: null}
  })
}

export const getUserDetails = async (userSession, sport, year, season, week) => {
  try {
    const getOptionsObj = getOptions(userSession)
    const sportValue = sport ? sport : 'nfl'
    return axios.get(`/api/extendedprofile?sport=${sport}&year=${year}&season=${season}&week=${week}`,getOptionsObj.callOptions)
    .then(resp => resp.data)
  } catch (error) {
    console.error(error)
  }

}

export const getFacebookUser = async (code, url) => {
  const details = {
    grant_type: 'authorization_code',
    code,
    client_id: userPool.clientId,
    redirect_uri: url.indexOf('localhost') > -1 ? 'http://localhost:8080' : `https://${url}`
  }
  const formBody = Object.keys(details)
    .map(
      key => `${encodeURIComponent(key)}=${encodeURIComponent(details[key])}`
    )
    .join("&");

  console.log({formBody});
  try {
    let res = await fetch(
    'https://crowdsourcedscores.auth.us-west-2.amazoncognito.com/oauth2/token',
      {
        method: "POST",
        headers: {
          'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody
      }
    )
    let tokenRequestJson = await res.json();
    
      let id_token = new CognitoIdToken({ IdToken: tokenRequestJson.id_token });
      let access_token = new CognitoAccessToken({ AccessToken: tokenRequestJson.access_token });
      let refresh_token = new CognitoRefreshToken({ RefreshToken: tokenRequestJson.refresh_token })
      let userSession = new CognitoUserSession({ IdToken: id_token, AccessToken: access_token, RefreshToken: refresh_token});
      let IdToken2 = userSession.getIdToken()
      const userData = {
        Username: IdToken2.payload['cognito:username'],
        Pool: userPool
      };
      
      let cognitoUser = new CognitoUser(userData);
      cognitoUser.setSignInUserSession(userSession);
      let authUser = Auth.createCognitoUser(userData.Username)
      authUser.setSignInUserSession(userSession);
      return cognitoUser;
  } catch (error) {
      console.log('userSession error: ', error);
    }
  }

  export const gameCannotBeUpdated = (startDateTime) => {
    //cutoff for odds updates is 1 hour prior to start
    const msHour = 300000;
    var now = new Date();
    var start = Date.parse(startDateTime);
    var cutoff = start - msHour;
    return (Date.parse(now) > cutoff)
  }

  export const spreadPrediction = (game, awayTeamScore, homeTeamScore) => {
    const { homeTeam, awayTeam } = game
    awayTeamScore = parseFloat(awayTeamScore)
    homeTeamScore = parseFloat(homeTeamScore)
    const {spread } = game.odds

    let oddsPredictionText = ''
    if (spread > 0) { // away team favored; e.g. spread = 3.5
      if ((awayTeamScore - homeTeamScore) < spread) { // user predicted home team to cover
        oddsPredictionText = `${homeTeam.code} +${spread}`
      } else if ((awayTeamScore - homeTeamScore) === spread) {
        oddsPredictionText = 'PUSH'
      } else {
        oddsPredictionText = `${awayTeam.code} -${spread}`
      }
    }
    if (spread <= 0) { // home team favored; e.g. spread = -3.5
      if ((awayTeamScore - homeTeamScore) > spread) { //user predicted away team to cover
        oddsPredictionText = `${awayTeam.code} +${spread * -1}`
      } else if ((awayTeamScore - homeTeamScore) === spread) {            
        console.log(`predicted spread: ${awayTeamScore - homeTeamScore} odds spread: ${spread}`)
        oddsPredictionText = 'PUSH'
      } else {
        oddsPredictionText = `${homeTeam.code} ${spread}`
      }
    }
    return oddsPredictionText;

  }
  export const totalPrediction = (game, awayTeamScore, homeTeamScore) => {
    const { homeTeam, awayTeam } = game
    awayTeamScore = parseFloat(awayTeamScore)
    homeTeamScore = parseFloat(homeTeamScore)
    const {total} = game.odds
      if ((awayTeamScore + homeTeamScore) > total) { //user predicted game to go over
        return `O${total}`
      } else if ((awayTeamScore + homeTeamScore) === total) {
        return `PUSH`
      } else {
        return `U${total}`
      }
  }


//export default fetchGame;

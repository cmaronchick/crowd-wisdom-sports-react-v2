import axios from 'axios';
import Auth from '@aws-amplify/auth'
import { 
  CognitoUser, 
  CognitoIdToken, 
  CognitoAccessToken, 
  CognitoRefreshToken, 
  CognitoUserSession, 
  CognitoUserPool } from 'amazon-cognito-identity-js'
import config from '../awsexports'

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

export const fetchGame = (sport, year, season, gameWeek, gameId, userSession) => {
  const getOptionsObj = getOptions(userSession);
  return axios.get(`/api/${sport}/games/${year}/${season}/${gameWeek}/${gameId}${getOptionsObj.anonString}`, getOptionsObj.callOptions)
    .then(resp => resp.data);
};

export const fetchGamesList = (sport, userSession) => {
  const getOptionsObj = getOptions(userSession)
  return axios.get(`/api/${sport}/games`, getOptionsObj.callOptions)
  .then (resp => resp.data.games);
};

export const fetchGameWeekGames = (sport, year, season, gameWeek, userSession) => {
  const getOptionsObj = getOptions(userSession)
  console.log(`api 41 /api/${sport}/games/${year}/${season}/${gameWeek}`);
  return axios.get(`/api/${sport}/games/${year}/${season}/${gameWeek}`, getOptionsObj.callOptions)
  .then (resp => resp.data.games);
};

export const fetchGameWeek = (sport, userSession) => {
  const getOptionsObj = getOptions(userSession)
  return axios.get(`/api/${sport}/gameWeek`, getOptionsObj.callOptions)
  .then(resp => resp.data)
}

export const fetchSubmitPrediction = async (userSession, prediction) => {
  // console.log({prediction})
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

export const getFacebookUser = async (code) => {
  const details = {
    grant_type: 'authorization_code',
    code,
    client_id: userPool.clientId,
    redirect_uri: 'http://localhost:8080'
  }
  const formBody = Object.keys(details)
    .map(
      key => `${encodeURIComponent(key)}=${encodeURIComponent(details[key])}`
    )
    .join("&");

  //console.log("getTokensOptions: ", getTokensOptions)
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
    console.log('tokenRequestJson: ', tokenRequestJson)
    const IdToken = new CognitoIdToken({ IdToken: tokenRequestJson.id_token });
    const AccessToken = new CognitoAccessToken({ AccessToken: tokenRequestJson.access_token });
    const RefreshToken = new CognitoRefreshToken({ RefreshToken: tokenRequestJson.refresh_token })
      try {
        let userSession = new CognitoUserSession({ IdToken, AccessToken, RefreshToken });
        
        const userData = {
          Username: IdToken.payload['cognito:username'],
          Pool: userPool
        };
        
        let cognitoUser = new CognitoUser(userData);
        cognitoUser.setSignInUserSession(userSession);
        let authUser = Auth.createCognitoUser(userData.Username)
        authUser.setSignInUserSession(userSession);
        return cognitoUser;
      }
      catch (FBSignInError) {
        //logger.debug('Logger FB: ', FBSignInError)
        console.log('FBSignInError: ', FBSignInError)
        return false;
      }
    }
    catch (error) {
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
    const {spread } = game.odds
    if (game.odds.spread > 0) { // away team favored; e.g. spread = 3.5
      if ((awayTeamScore - homeTeamScore) < spread) { // user predicted home team to cover
        oddsPrediction = `${homeTeam.code} +${spread}`
      } else if ((awayTeamScore - homeTeamScore) === spread) {
        oddsPredictionText = 'PUSH'
      } else {
        oddsPredictionText = `${awayTeam.code} -${spread}`
      }
    }
    if (game.odds.spread < 0) { // home team favored; e.g. spread = -3.5
      if ((awayTeamScore - homeTeamScore) > spread) { //user predicted away team to cover
        oddsPredictionText = `${awayTeam.code} +${spread * -1}`
      } else if ((awayTeamScore - homeTeamScore) === spread) {
        oddsPredictionText = 'PUSH'
      } else {
        oddsPredictionText = `${homeTeam.code} ${spread}`
      }
    }
    if ((awayTeamScore - homeTeamScore) < spread) {
      oddsPredictionText += `<br/><span className="predictionDetails">(${(awayTeamScore > homeTeamScore) ? game.awayTeam.code : game.homeTeam.code} by ${(awayTeamScore > homeTeamScore) ? (awayTeamScore - homeTeamScore) : (homeTeamScore - awayTeamScore)}</span>`
    }
    return oddsPredictionText;

  }
  export const totalPrediction = (game, awayTeamScore, homeTeamScore) => {
    const { homeTeam, awayTeam } = game
    const {total} = game.odds
      if ((awayTeamScore > homeTeamScore) > total) { //user predicted game to go over
        return `O${total}`
      } else if ((awayTeamScore - homeTeamScore) === total) {
        return `PUSH`
      } else {
        return `U${total}`
      }
  }


//export default fetchGame;

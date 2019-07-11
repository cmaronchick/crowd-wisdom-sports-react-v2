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
  return axios.get(`/api/${sport}/${year}/${season}/${gameWeek}/${gameId}${getOptionsObj.anonString}`, getOptionsObj.callOptions)
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

export const fetchSubmitPrediction = (userSession, prediction) => {
  console.log('api 55: ', prediction)
  const postOptionsObj = postOptions(userSession, prediction)
  console.log('postOptionsObj: ', postOptionsObj)
  return axios.post('/api/submitPrediction', postOptionsObj)
  .then(resp => resp.data)
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

export const fetchOverallLeaderboard = (userSession, sport, year, season, week) => {
  const getOptionsObj = getOptions(userSession)
  const sportValue = sport ? sport : 'nfl'
  return axios.get(`/api/${sportValue}/leaderboards/${year}/${season}/${week}`, getOptionsObj.callOptions)
  .then(resp => resp.data)
}

export const fetchWeeklyLeaderboard = (userSession, sport, year, season, week) => {
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


//export default fetchGame;

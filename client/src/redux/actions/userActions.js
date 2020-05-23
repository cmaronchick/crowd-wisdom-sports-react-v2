import {
    SET_AUTHENTICATED,
    SET_USER,
    SIGN_IN_USER,
    SIGN_UP_USER,
    SET_UNAUTHENTICATED,
    SET_ERRORS,
    LOADING_USER,
    TOGGLE_LOGIN_MODAL
} from '../types'
import ky from 'ky/umd'
import { getUrlParameters } from '../../functions/utils'
import { Auth } from '@aws-amplify/auth'
import awsmobile from '../../awsmobile'
import Amplify from 'aws-amplify'
import { 
    CognitoUser, 
    CognitoIdToken, 
    CognitoAccessToken, 
    CognitoRefreshToken, 
    CognitoUserSession, 
    CognitoUserPool } from 'amazon-cognito-identity-js'

import store from '../store'
import { fetchGame, fetchGameWeekGames } from './gamesActions'
import { setSport, setGameWeek } from './sportActions'

const userPool = new CognitoUserPool({
    UserPoolId: awsmobile.aws_user_pools_id,
    ClientId: awsmobile.aws_user_pools_web_client_id,
})

export const getFacebookUser = (location) => async (dispatch) => {
    let code = getUrlParameters(location.search, 'code')
    console.log('userPool', userPool)
   const details = {
     grant_type: 'authorization_code',
     code,
     client_id: userPool.clientId,
     redirect_uri: `${location.origin}/callback`
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
     console.log('tokenRequestJson', tokenRequestJson)
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
       console.log('authUser', authUser)
       if (location.href.indexOf('/callback') > -1) {
           const facebookLoginFromPage = localStorage['facebookLoginFromPage']
           if (facebookLoginFromPage && facebookLoginFromPage !== 'null') {
               window.location.href=facebookLoginFromPage
           } else {
            window.location.href='/'
           }
       }
       return cognitoUser;
    } catch (error) {
       console.log('userSession error: ', error);
    }  
}

export const login = (username, password) => async (dispatch) => {
    dispatch({
        type: SIGN_IN_USER
    })
    try {
        let currentUser = await Auth.signIn(username, password);
        dispatch({
            type: SET_USER,
            payload: {
                ...currentUser.attributes
            }
        })
        if (Object.keys(store.getState().sport.gameWeekData).length > 0) {
            const { sport, year, season, week } = store.getState().sport.gameWeekData
            dispatch(fetchGameWeekGames(sport, year, season, week))
        } else {
            dispatch(setSport('nfl'))
        }
        dispatch({
            type: TOGGLE_LOGIN_MODAL,
            payload: false
        })
    } catch (loginError) {
        console.log('loginError', loginError)
        dispatch({
            type: SET_ERRORS,
            payload: loginError
        })
        dispatch({
            type: SET_UNAUTHENTICATED
        })
    }
}

export const logout = () => async (dispatch) => {
    try {
        await Auth.signOut()
        dispatch({
            type: SET_UNAUTHENTICATED
        })
        if (Object.keys(store.getState().sport.gameWeekData).length > 0) {
            const { sport, year, season, week } = store.getState().sport.gameWeekData
            dispatch(fetchGameWeekGames(sport, year, season, week))
        } else {
            dispatch(setSport('nfl'))
        }
        
    } catch (logoutError) {
        dispatch({
            type: SET_ERRORS,
            errors: logoutError
        })
    }
}


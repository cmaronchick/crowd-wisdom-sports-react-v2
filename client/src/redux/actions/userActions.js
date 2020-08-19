import {
    SET_AUTHENTICATED,
    SET_USER,
    SIGN_IN_USER,
    SIGN_UP_USER,
    SET_USER_UNCONFIRMED,
    SET_FORGOT_PASSWORD,
    SET_RESET_PASSWORD_SENT,
    SET_UNAUTHENTICATED,
    SET_ERRORS,
    LOADING_USER,
    TOGGLE_LOGIN_MODAL,
    UPDATE_USER,
    UPDATING_USER,
    CHANGING_PASSWORD,
    CHANGE_USER_DETAILS
} from '../types'
import ky from 'ky/umd'
import { getUrlParameters } from '../../functions/utils'
import Amplify, { Auth, Storage } from 'aws-amplify'
import awsmobile from '../../awsmobile'
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

import { apiHost } from '../../constants/config'

const userPool = new CognitoUserPool({
    
    UserPoolId: awsmobile.aws_user_pools_id,
    ClientId: awsmobile.aws_user_pools_web_client_id,
})
Amplify.configure({
    Auth: {
        region: 'us-west-2',
        identityPoolId: 'us-west-2:7f74c720-5f61-4b1d-b9fd-81ae626cfd40',
        userPoolId: awsmobile.aws_user_pools_id,
        userPoolWebClientId: awsmobile.aws_user_pools_web_client_id,
    },
    Storage: {
        bucket: 'stakehousesports-userfiles',
        region: 'us-west-2',
    }
})

export const getFacebookUser = (location) => async (dispatch) => {
    console.log('location', location)
    let code = getUrlParameters(location.search, 'code')
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
   try {
       console.log('formBody', formBody)
     let res = await ky.post(
     'https://crowdsourcedscores.auth.us-west-2.amazoncognito.com/oauth2/token',
       {
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
       let currentUser = await Auth.currentAuthenticatedUser();
       console.log('currentUser', currentUser)
       dispatch({
            type: SET_USER,
            payload:  {
                username: currentUser.username,
                attributes: currentUser.attributes
            }
       })
       if (location.href.indexOf('/callback') > -1) {
           const facebookLoginFromPage = localStorage['facebookLoginFromPage']
           if (facebookLoginFromPage && facebookLoginFromPage !== 'null') {
            delete localStorage['facebookLoginFromPage']   
            window.history.pushState({ message: 'Facebook Login'}, 'Stakehouse Sports', facebookLoginFromPage)

           } else {
            window.location.href=window.history.pushState({ message: 'Facebook Login'}, 'Stakehouse Sports','/')
           }
       }
    } catch (error) {
       console.log('userSession error: ', error);
       const facebookLoginFromPage = localStorage['facebookLoginFromPage']
       if (facebookLoginFromPage && facebookLoginFromPage !== 'null') {
        delete localStorage['facebookLoginFromPage']   
        window.history.pushState({error}, 'Login error', facebookLoginFromPage)

       } else {
        window.history.pushState({ error }, 'Login error', '/')
       }
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
                username: currentUser.username,
                attributes: currentUser.attributes
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
        if (loginError.code === "UserNotConfirmedException") {
            dispatch({
                type: SET_USER_UNCONFIRMED
            })
        } else {
            dispatch({
                type: SET_ERRORS,
                payload: loginError
            })
            dispatch({
                type: SET_UNAUTHENTICATED
            })
        }
    }
}

export const signUp = (username, password, attributes, picture) => async (dispatch) => {
    dispatch({
        type: SIGN_UP_USER
    })
    try {
        if (picture) {
        console.log('picture, picture.type', picture, picture.type)
        }
        if (picture && picture.type !== 'image/jpeg' && picture.type !== 'image/png') {
                return {
                    type: SET_ERRORS,
                    errors: 'Please upload either a JPG or PNG.'
                }
        }
        let signUpResponse = await Auth.signUp({
            username,
            password,
            attributes: {
                email: attributes.email,             // optional
                given_name: attributes.given_name,
                family_name: attributes.family_name,
                picture: `https://stakehousesports-userfiles.s3-us-west-2.amazonaws.com/public/${picture ? `${username}-${picture.name}` : `blank-profile-picture.png`}`,
                ['custom:notifyPredictRemind']: attributes['custom:notifyPredictRemind'] ? '1' : '0',
                ['custom:acceptRulesandTOU']: '1',
                // phone_number,      // optional - E.164 number convention
                // Other custom attributes...
            },
        })
            if (picture) {
                const filename = `${username}-${picture.name}`;
                const stored = await Storage.put(filename, picture, {
                    contentType: picture.type
                });
                console.log('stored.key', stored)
                // return stored.key;
                // console.log('uploadImageResponse', uploadImageResponse)
                // dispatch(getUserData())
                // updateUserDetails({
                //     picture: `https://stakehousesports-userfiles.s3-us-west-2.amazonaws.com/public/${filename}`
                // })
            }
            dispatch({
                type: SET_USER_UNCONFIRMED
            })
    } catch (signUpError) {
        console.log('signUpError', signUpError)
        dispatch({
            type: SET_UNAUTHENTICATED
        })
        dispatch({
            type: SET_ERRORS,
            payload: signUpError
        })
    }
}

export const confirmUser = (username, code) => async (dispatch) => {
    // TODO - SET ANALYTICS
    try {
        let confirmResponse = await Auth.confirmSignUp(username, code)
        console.log('confirmResponse', confirmResponse)
        dispatch({
            type: SET_UNAUTHENTICATED
        })
    } catch (confirmUserError) {
        console.log('confirmUserError', confirmUserError)
    }
}

export const resendConfirmation = (username) => async (dispatch) => {
    try {
        let resendResponse = await Auth.resendSignUp(username)
        console.log('resendResponse', resendResponse)
    } catch (resendConfirmationError) {
        console.log('resendConfirmationError', resendConfirmationError)
        dispatchEvent({
            type: SET_ERRORS,
            payload: resendConfirmationError
        })
        dispatch({
            type: SET_UNAUTHENTICATED
        })
    }
}

export const forgotPassword = (username) => async (dispatch) => {
    try {
        dispatch({
            type: SET_FORGOT_PASSWORD
        })
        let forgotPasswordResponse = await Auth.forgotPassword(username)
        dispatch({
            type: SET_RESET_PASSWORD_SENT
        })
    } catch(forgotPasswordError) {
        console.log('forgotPasswordError', forgotPasswordError)
        dispatch({
            type: SET_ERRORS,
            payload: forgotPasswordError
        })
        dispatch({
            type: SET_UNAUTHENTICATED
        })
    }
}

export const resetPassword = (username, password, code) => async (dispatch) => {
    try {
        let resetPasswordResponse = await Auth.forgotPasswordSubmit(username, code, password)
        console.log('resetPasswordResponse', resetPasswordResponse)
        let currentUser = await Auth.currentAuthenticatedUser()
        console.log('currentUser', currentUser)
        dispatch({
            type: SET_USER,
            payload: currentUser
        })
    } catch (resetPasswordError) {
        console.log('resetPasswordError', resetPasswordError)
        // dispatch({
        //     type: SET_UNAUTHENTICATED
        // })
        dispatch({
            type: SET_ERRORS,
            payload: resetPasswordError
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

export const getUserDetails = (sport, year, season, week) => async (dispatch) => {
    try {
        let currentSession = await Auth.currentSession()
        let IdToken = await currentSession.getIdToken().getJwtToken()
        let getProfileResponse = await apiHost.get(`extendedprofile?sport=${sport}&year=${year}&season=${season}&week=${week}`,{
            headers: {
                Authorization: IdToken
            }
        }).json()
        dispatch({
            type: SET_USER,
            payload: {
                details: getProfileResponse
            }
        })
    } catch (getProfileResponseError) {
      console.error(getProfileResponseError)
      dispatch({
          type: SET_ERRORS,
          errors: getProfileResponseError
      })
    }
  }

export const changeUserDetails = (attributeKey, attributeValue) => {

    return {
        type: CHANGE_USER_DETAILS,
        payload: {
            attributeKey,
            attributeValue
        }
    }
}

export const updateUserDetails = async (attributes) => {
    try {
        let currentUser = await Auth.currentAuthenticatedUser();
        let updateResponse = await Auth.updateUserAttributes(currentUser, attributes);
        console.log('updateResponse', updateResponse)
        return {
            type: UPDATE_USER,
            payload: {
                username: currentUser.username,
                attributes: {
                    ...currentUser.attributes,
                    ...attributes
                }
            }
        }
    } catch (updateUserError) {
        console.log('updateUserError', updateUserError)
        return {
            type: SET_ERRORS,
            errors: updateUserError
        }
    }
}

export const uploadImage = async (image) => {
    try {
        let currentUser = await Auth.currentAuthenticatedUser();
        let currentSession = await Auth.currentSession()
        let IdToken = currentSession.getIdToken().getJwtToken()
        // console.log('formData', formData)
        // let uploadImageResponse = await apiHost.post('user/image', {
        //     headers: {
        //         Authorization: IdToken
        //     },
        //     body: formData
        // })

        // for (var key of formData.entries()) {
        //     console.log(key[0] + ', ' + key[1]);
        // }
        console.log('image.type', image.type)
        if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
            return {
                type: SET_ERRORS,
                errors: 'Please upload either a JPG or PNG.'
            }
        }
        const filename = `${currentUser.username}-${image.name}`;
        console.log('image', image)
        const stored = await Storage.put(filename, image, {
            contentType: image.type
        });
        console.log('stored.key', stored)
        // return stored.key;
        // console.log('uploadImageResponse', uploadImageResponse)
        // dispatch(getUserData())
        updateUserDetails({
            picture: `https://stakehousesports-userfiles.s3-us-west-2.amazonaws.com/public/${filename}`
        })
        return {
            type: UPDATE_USER,
            payload: {
                username: currentUser.username,
                attributes: {
                    ...currentUser.attributes,
                    picture: `https://stakehousesports-userfiles.s3-us-west-2.amazonaws.com/public/${filename}`
                }
            }
        }
    } catch (uploadImageError) {
        console.log('uploadImageError', uploadImageError)
        return {
            type: SET_ERRORS,
            errors: uploadImageError
        }
    }

}

export const changePassword = (currentPassword, newPassword) => async (dispatch) => {
    dispatch({
        type: CHANGING_PASSWORD
    })
    try {
        let currentUser = await Auth.currentAuthenticatedUser()
        let changePasswordResponse = await Auth.changePassword(currentUser, currentPassword, newPassword)
        console.log('changePasswordResponse', changePasswordResponse)
        dispatch({
            type: UPDATE_USER,
            payload: {
                username: currentUser.username,
                attributes: currentUser.attributes
            }
        })
    } catch (changePasswordError) {
        console.log('changePasswordError', changePasswordError)
        dispatch({
            type: SET_ERRORS,
            errors: changePasswordError
        })
    }
}


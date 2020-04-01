import Auth from '@aws-amplify/auth'


const onChangeGameScore = (gameId, event) => {
    return true;   
}

const submitPrediction = async (gameId) => {
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
  }
}

const predictionResultWinnerEval = (game, prediction) => {
    let awayTeamWin = (game.awayTeam.score > game.homeTeam.score)
    let homeTeamWin = (game.awayTeam.score < game.homeTeam.score)
    let awayTeamPredictionWin = (prediction.awayTeam.score > prediction.homeTeam.score)
    let homeTeamPredictionWin = (prediction.awayTeam.score < prediction.homeTeam.score)
    if (awayTeamWin && awayTeamPredictionWin) return true;
    if (homeTeamWin && homeTeamPredictionWin) return true;
    return false;
}
const predictionResultSpreadEval = (game, prediction) => {
    let awayTeamWin = (game.awayTeam.score > game.homeTeam.score)
    let homeTeamWin = (game.awayTeam.score < game.homeTeam.score)
    let awayTeamPredictionWin = (prediction.awayTeam.score > prediction.homeTeam.score)
    let homeTeamPredictionWin = (prediction.awayTeam.score < prediction.homeTeam.score)
    if (awayTeamWin && awayTeamPredictionWin) return true;
    if (homeTeamWin && homeTeamPredictionWin) return true;
    return false;
}

const formatDate = (startDateTime) => {
    var gameDate = new Date(startDateTime);
    var options = { weekday: 'short', month: 'short', day: 'numeric', year: '2-digit', hour: 'numeric', minute: 'numeric', timeZoneName: 'short' };
    var newstartDateTime = gameDate.toLocaleString('en-US', options);
    return newstartDateTime;
  }

const resendConfirmation = async () => {
  try {
    let resendSignUpResponse = await Auth.resendSignUp(this.state.username)
    console.log('resendSignUpResponse: ', resendSignUpResponse)
    return {resendSignUpResponse};
  } catch(resendSignUpReject) {
    console.log('resendSignUpReject: ', resendSignUpReject)
    return {error: resendSignUpReject}
  }
}

const signIn = async (username, password) => {
  try {
    let user = await Auth.signIn(username, password)
  
    console.log('user: ', user)
    return user;
  } catch(signInError) {
    if (signInError.code === 'UserNotConfirmedException') {
      return { error: signInError };
    }
    console.log('signInError: ', signInError)
    return { error: signInError }
  }
}
const signOut = async () => {
  try{
    let signOutResponse = await Auth.signOut();
    return { signOutResponse }
  } catch(signOutError) {
    console.log('signOutError: ', signOutError)
    return { error: signOutError}
  }
}

const resetPassword = async() => {
  try {
    let forgotPasswordResponse = await Auth.forgotPassword(this.state.username)
    return { forgotPasswordResponse }
  } catch (forgotPasswordError) {
    console.log({forgotPasswordError})
    return { error: forgotPasswordError }
  }
}

const submitNewPassword = async() => {
  try {
    let sendingNewPasswordResponse = await Auth.forgotPasswordSubmit(this.state.username, this.state.confirmUserCode, this.state.newPassword)
    console.log({sendingNewPasswordResponse});
    return { sendingNewPasswordResponse }
  } catch (forgotPasswordError) {
    console.log({forgotPasswordError})
    return { error: forgotPasswordError }
  }
}

const changePassword = async(e) => {
  console.log('changePassword: ', e)
  e.preventDefault()
  const { profileCurrentPassword, profileNewPassword, profileConfirmPassword } = this.state;
  if (profileNewPassword !== profileConfirmPassword) {
    this.setState({profilePasswordMatch: false})
    return { success: false, message: 'Your passwords do not match' }
  }
  try {
    let user = await Auth.currentAuthenticatedUser()
    let passwordResponse = await Auth.changePassword(user, profileCurrentPassword, profileNewPassword);
    console.log('passwordResponse :', passwordResponse);
    return { success: true, message: passwordResponse }
    this.setState({ changePasswordModalVisible: false })
  } catch(changePasswordError) {
    console.log('changePasswordError :', changePasswordError);
    return { success: false, message: changePasswordError }
  }
}

  // Sign up user with AWS Amplify Auth
const signUp = async (username, password, givenName, familyName, email, emailOptIn) => {
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
      // ReactGA.event({
      //   category: 'account',
      //   action: 'signup',
      //   label: 'submit',
      //   value: 'true'
      // })
      return { signUpResponse }
    } catch(err) {
      if (! err.message) {
          console.log('Error when signing up: ', err)
          // Alert.alert('Error when signing up: ', err)
      } else {
          console.log('Error when signing up: ', err, '; ', err.message)
          // Alert.alert('Error when signing up: ', err.message)
      }
      // ReactGA.event({
      //   category: 'account',
      //   action: 'signup',
      //   label: 'submitFail',
      //   value: JSON.stringify(err)
      // })
    }
}

const confirmUser = async (confirmUserCode, username) => {
  try {
    let confirmResponse = await Auth.confirmSignUp(username, confirmUserCode)
    // ReactGA.event({
    //   category: 'account',
    //   action: 'signup',
    //   label: 'complete',
    //   value: 'true'
    // })
    console.log('confirmResponse: ', confirmResponse)
    return { error: null, message: confirmResponse }
  } catch(confirmReject) {
    console.log('confirmReject: ', confirmReject)
    // ReactGA.event({
    //   category: 'account',
    //   action: 'signup',
    //   label: 'complete',
    //   value: JSON.stringify(confirmReject)
    // })
    return { error: confirmReject }
  }
}

const AmplifyAuth = (req, res, next) => {
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization
    } else {
        console.error('No Token found')
        return res.status(403).json({ error: 'Unauthorized'})
    }
    
}

export { onChangeGameScore, submitPrediction, predictionResultWinnerEval, predictionResultSpreadEval, formatDate, AmplifyAuth, signUp, signIn, signOut, confirmUser, resendConfirmation, resetPassword, submitNewPassword, changePassword }
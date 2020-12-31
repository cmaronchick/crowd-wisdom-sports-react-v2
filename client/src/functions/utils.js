import React from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import StakeIcon from '../images/stake-image-blue-dual-ring.svg'

export const getUrlParameters = (redirectUrl, sParam) => {
    const sURLQueryString = redirectUrl.split('?');
    const sURLVariables = sURLQueryString[1].split('&')
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            if (sParameterName[1].indexOf("#") > -1) {
                var code = sParameterName[1].split('#');
                console.log('code', code)
                return code[0];
            }
            return sParameterName[1];
        }
    }
  }
  
  export const generateRandomString = function(length) {
      let text = '';
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
      for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
  };

  export const isEmail = (email) => {
      const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (email.match(emailRegEx)) {
          return true;
      } else {
          return false;
      }
  }



  export const checkGameStart = (startDateTime) => {
    //cutoff for odds updates is 1 hour prior to start
    const msHour = 300000;
    var now = new Date();
    var start = Date.parse(startDateTime);
    var cutoff = start - msHour;
    return (Date.parse(now) > cutoff)
  }

  export const spreadPrediction = (game, odds, awayTeamScore, homeTeamScore) => {
    const { homeTeam, awayTeam } = game
    awayTeamScore = parseFloat(awayTeamScore)
    homeTeamScore = parseFloat(homeTeamScore)
    const {spread } = odds

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
  export const totalPrediction = (game, odds, awayTeamScore, homeTeamScore) => {
    const { homeTeam, awayTeam } = game
    awayTeamScore = parseFloat(awayTeamScore)
    homeTeamScore = parseFloat(homeTeamScore)
    const {total} = odds
      if ((awayTeamScore + homeTeamScore) > total) { //user predicted game to go over
        return `O${total}`
      } else if ((awayTeamScore + homeTeamScore) === total) {
        return `PUSH`
      } else {
        return `U${total}`
      }
  }

const imageIsLoaded = (e) => {
    document.getElementById('avatarImage').setAttribute('src', e.target.result)
}

export const handleImageChange = (event) => {
  event.preventDefault()
  const image = event.target.files[0]
  console.log('image', image)
  let formData = new FormData()
  formData.append('image', image, image.name);
  let fileReader = new FileReader();
  fileReader.readAsDataURL(image)
  fileReader.onload = imageIsLoaded
  localStorage.setItem('avatar', formData)
}
export const handleEditPicture = () => {
    const fileInput = document.getElementById('imageInput')
    fileInput.click();
}

export const antIcon = (props) => {
    console.log('props', props)
    return (<LoadingOutlined style={{ fontSize: 24 }} spin />)
}
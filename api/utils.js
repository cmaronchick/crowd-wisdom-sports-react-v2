
const callOptions = (userToken) => {
    var anonString = '/anon'
    var callOptions = {};
    //console.log('api index 17 userToken: ', userToken)
    if (userToken) {
      callOptions = {
        headers: {
          Authorization: userToken
        }
      }
      anonString = '';
    }
    return { anonString, callOptions };
  }

  module.exports = {callOptions}
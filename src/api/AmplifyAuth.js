const AmplifyAuth = (req, res, next) => {
    var anonString = '/anon'
    var callOptions = {};
    //console.log('api index 17 userToken: ', userToken)
    if (req.headers.Authorization) {
      callOptions = {
        headers: {
          Authorization: userToken
        }
      }
      anonString = '';
    }
    req.anonString = anonString
    req.callOptions = callOptions;
    return next()   
}

module.exports = { AmplifyAuth }
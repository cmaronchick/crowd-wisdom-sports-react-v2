const ky = require('ky-universal');
const apiHost = ky.create({prefixUrl: `https://3tsywitgn8.execute-api.us-west-2.amazonaws.com/dev/`})
const { callOptions } = require('../utils')

const getLeaderboards = (req, res) => {
    const callOptionsObject = callOptions(req.headers.authorization);
    const anonString = callOptionsObject.anonString;
    const getOptions = callOptionsObject.callOptions;
    getOptions.timeout = 30000; // leaderboard takes 15 seconds to complete
    const { sport, year, season, week } = req.params
    console.log(`Leaderboard URL: ${sport}/${year}/${season}/${week}/leaderboards`, getOptions)
    return apiHost.get(`${sport}/${year}/${season}/${week}/leaderboards`, getOptions)
    .then((overallLeaderboardResponse) => {
      // console.log('overallLeaderboardResponse: ', overallLeaderboardResponse)
      return overallLeaderboardResponse.json()
    })
    .then(leaderboardResponse => {
        console.log('leaderboardResponse handler json', leaderboardResponse)
      return res.status(200).json({ leaderboards: leaderboardResponse
      })
    })
    .catch(overallLeaderboardReject => {
      console.log('overallLeaderboardReject 22: ', overallLeaderboardReject);
      return res.status(500).json({ message: 'Something went wrong'});
    })
}

const getCrowdLeaderboards = (req, res) => {
    const { sport, year, season, week } = req.params;
    console.log('leaderboards 28', { sport, year, season, week });
    const callOptionsObject = callOptions(req.headers.authorization);
    const anonString = callOptionsObject.anonString;
    const getOptions = callOptionsObject.callOptions;
    // console.log('getCrowdLeaderboards getOptions: ', getOptions); 
    return apiHost.get(`${sport}/${year}/${season}/${week}/leaderboards/crowdoverall`, getOptions)
    .then((crowdOverallResponse) => {
      // console.log('crowdOverallResponse: ', crowdOverallResponse) 
      return crowdOverallResponse.json()
    })
    .then(crowdOverallResponseJSON => {
      // console.log('api/index 134 crowdOverallResponse', crowdOverallResponse)
       return res.send({ crowd: crowdOverallResponseJSON })
     })
     .catch(async (crowdOverallResponseError) => {
      console.log('api leaderboard index 137 crowdOverallResponse: ', crowdOverallResponseError)
      if (crowdOverallResponseError.response) {
        crowdOverallResponseError = await crowdOverallResponseError.response.json()
      }
      return res.status(500).json({ message: crowdOverallResponseError })
     })
}

module.exports = { getLeaderboards, getCrowdLeaderboards }
const ky = require('ky-universal');
const apiHost = ky.create({prefixUrl: `https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/`})
const { callOptions } = require('../utils')

const getSportSeason = (req, res) => {
    const callOptionsObject = callOptions(req.headers.authorization);
    const anonString = callOptionsObject.anonString;
    const getOptions = callOptionsObject.callOptions;
    console.log('84 req.params', req.params)
    const { sport, year, season } = req.params;
      return apiHost.get(`${sport}/${year}/${season}`, getOptions)
      .then((seasonDetailsReponse) => {
          return seasonDetailsReponse.json()
      })
      .then(seasonDetails => {
        return res.status(200).json({ data: seasonDetails })
      })
      .catch(seasonDetailsReponseError => {
        let errorMessage = seasonDetailsReponseError
          console.log('api index 72 seasonDetailsReponseError: ', seasonDetailsReponseError)
          return res.status(500).json({ message: `Something went wrong. - ${errorMessage}`})
      })

}

module.exports = { getSportSeason }
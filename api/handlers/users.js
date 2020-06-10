const ky = require('ky-universal');
const apiHost = ky.create({prefixUrl: `https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/`})
const { callOptions } = require('../utils')

const getExtendedProfile = (req, res) => {
    //console.log({req: req.params});
    let { sport, year, season, week } = req.query;
    const callOptionsObject = callOptions(req.headers.authorization);
    const getOptions = callOptionsObject.callOptions;
    return ky.get(`${apiHost}extendedprofile?sport=${sport}&year=${year}&season=${season}&week=${week}`, getOptions)
    .then((userStatsResponse) => {
      // console.log('api/index 134 crowdOverallResponse', crowdOverallResponse)
       res.send({ userStatsResponse: userStatsResponse.data })
     })
     .catch(userStatsResponseError => console.log('api leaderboard index 150 userStatsResponseError: ', userStatsResponseError))
  
}

const uploadImage = (req, res) => {
    console.log('req.user', req.headers)
    const BusBoy = require('busboy')
    const path = require('path')
    const os = require('os')
    const fs = require('fs')
  
    const busboy = new BusBoy({ headers: req.headers })
    let imageFilename;
    let imageToBeUploaded = {};
  
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
            return res.status(400).json({ error: 'Please submit JPG or PNG files only.'})
        }
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        const imageExtension = filename.split('.')[filename.split('.').length-1];
        imageFilename = `${Math.round(Math.random()*100000000000)}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFilename);
        console.log('filepath', filepath)
        imageToBeUploaded = { filepath, mimetype }
        return file.pipe(fs.createWriteStream(filepath))
    });
    //console.log('imageToBeUploaded', imageToBeUploaded)
    busboy.on('finish', () => {
            return Amplify.Storage.put(`/users/avatars/${imageToBeUploaded.filepath}`, 'Protected Content', {
              level: 'public',
              contentType: imageToBeUploaded.mimetype
            })
        .then(() => {
            console.log('file uploaded')
            return res.status(200).json({ message: 'Image uploaded successfully'})
        })
        .catch((uploadImageError) => {
            console.error(uploadImageError)
            return res.status(500).json({uploadImageError})
  
        })
    })
    busboy.end(req.rawBody);
}

module.exports = { getExtendedProfile, uploadImage }
const path = require("path");
let media = {}

uploadMedia = async (req, res) => {
    console.log("-------------uploadMedia")
    const image = req.files.image;
    let imageID = Math.floor(Math.random() * Date.now());
    const normpath = "./public/images/" + image.name;
    media[imageID] = image.name;
    console.log(imageID, media[imageID])
    image.mv(normpath, (error) => {
        if (error) {
            console.error(error)
            res.status(200).json({ status: 'error', message: error });
            res.end();
            return;
        }
        res.status(200).json({ status: 'ok', mediaid: imageID });
        res.end();
    })
}

accessMedia = async (req, res) => {
    console.log("-------------accessMedia")
    const id = req.params.id;
    console.log(id)
    var fs = require('fs');

    const normpath = "./public/images/" + media[id];
    const webpath = "http://209.151.154.192/images/" + media[id];
    const image = fs.readFileSync(normpath);
    
    if(media[id] !== false) {
        res.status(200).json({status: 'ok', image: webpath});
        res.end();
        return;
    }
    res.status(404).json({status: 'error', message: '404 NOT FOUND'})
    res.end();
}

module.exports = {
    uploadMedia,
    accessMedia
}
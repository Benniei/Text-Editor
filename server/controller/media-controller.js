const path = require("path");
let media = {}

uploadMedia = async (req, res) => {
    console.log("-------------uploadMedia")
    var image = req.files.file;
    if(image.mimetype !== 'image/jpeg' && image.mimetype !== 'image/png'){
        return res.status(200).json({error: true, status: 'error'})
    }
    let imageID = Math.floor(Math.random() * Date.now());
    const normpath = "./public/images/" + image.name;
    media[imageID] = image;
    image.mv(normpath, (error) => {
        if (error) {
            console.error(error)
            res.status(200).json({ status: 'error', message: error });
            res.end();
            return;
        }
        return res.status(200).json({ status: 'ok', mediaid: imageID, name: image.name }).end();
    })
}

accessMedia = async (req, res) => {
    console.log("-------------accessMedia")
    const id = req.params.id;
    console.log(id)
    var fs = require('fs');
    console.log(media)
    const picture = media[id]
    var pathToFile = path.join(__dirname, "..", "public", "images", picture.name)
    if(picture !== false) {
        res.sendFile(pathToFile, (err) => {
            if (err) console.log(err)
            console.log('Sent:', picture.name); //Outputs "Sent: example-text.txt" in the console
            res.end();
        });
    }
    else{
        res.status(404).json({status: 'error', message: '404 NOT FOUND'})
        res.end();
    }
}

module.exports = {
    uploadMedia,
    accessMedia
}
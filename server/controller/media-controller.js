const path = require("path");
let media = {}

uploadMedia = async (req, res) => {
    console.log("-------------uploadMedia")
    var image = req.files.file;
    if(image.mimetype !== 'image/jpeg' && image.mimetype !== 'image/png'){
        return res.status(200).json({error: true, status: 'error'})
    }
    console.log(image)
    let imageID = Math.floor(Math.random() * Date.now());
    const normpath = "./public/images/" + image.name;
    media[imageID] = image;
    console.log(imageID, media[imageID])
    image.mv(normpath, (error) => {
        if (error) {
            console.error(error)
            res.status(200).json({ status: 'error', message: error });
            res.end();
            return;
        }
        return res.status(200).json({ status: 'ok', mediaid: imageID }).end();
    })
}

accessMedia = async (req, res) => {
    console.log("-------------accessMedia")
    const id = req.params.id;
    console.log(id)
    var fs = require('fs');
    const picture = media[id]
    var pathToFile = path.join(__dirname, "..", "public", "images", picture.name)
    console.log(pathToFile)
    console.log(picture)
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
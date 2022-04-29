const path = require("path");

uploadMedia = async (req, res) => {
    console.log("-------------uploadMedia")
    var image = req.files.file;
    var extension
    if(image.mimetype !== 'image/jpeg' && image.mimetype !== 'image/png' && image.mimetype !== 'image/gif'){
        return res.status(200).json({error: true, status: 'error'})
    }
    else{
        extension = image.mimetype.substring(mime.indexOf("/") + 1)
    }
    let imageID = Math.floor(Math.random() * Date.now()) + "." + extension;
    const normpath = "./public/images/" + imageID;
    media[imageID] = image;
    image.mv(normpath, (error) => {
        if (error) {
            console.error(error)
            res.status(200).json({ status: 'error', message: error });
            res.end();
            return;
        }
        return res.status(200).json({ status: 'ok', mediaid: imageID, name: imageID }).end();
    })
}

accessMedia = async (req, res) => {
    console.log("-------------accessMedia")
    const id = req.params.id;
    console.log(id)
    var fs = require('fs');
    var pathToFile = path.join(__dirname, "..", "public", "images", id)
    if(picture !== false) {
        res.sendFile(pathToFile, (err) => {
            if (err) console.log(err)
            console.log('Sent:', id); //Outputs "Sent: example-text.txt" in the console
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
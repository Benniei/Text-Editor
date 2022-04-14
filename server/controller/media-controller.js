let media = {}

uploadMedia = async (req, res) => {
    const image = req.files.image;
    let imageID = Math.floor(Math.random() * Date.now());
    const path = "C:/Users/brand/Downloads/images/" + image.name;
    media[imageID] = path;

    image.mv(path, (error) => {
        if (error) {
            console.error(error)
            res.status(200).write(JSON.stringify({ status: 'error', message: error }));
            res.end();
            return;
        }
        res.status(200).write(JSON.stringify({ status: 'success', id: imageID }));
        res.end();
    })
}

accessMedia = async (req, res) => {
    const id = req.params.id;
    var fs = require('fs');
    const image = fs.readFileSync(media[id]);
    if(media[id] !== false) {
        res.status(200).write(JSON.stringify({status: 'success', image: image}));
        res.end();
        return;
    }
    res.status(404).write(JSON.stringify({status: 'error', message: '404 NOT FOUND'}))
    res.end();
}

module.exports = {
    uploadMedia,
    accessMedia
}
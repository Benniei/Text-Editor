const Text = require('../models/text-model')
const url = require('url')

search = async (req, res) => {
    var queryContent = url.parse(req.url, true).query.q;
    const searchRes = await Text.search({
        query_string: {
            query: queryContent
        }
    },
    {
    highlight: {
        number_of_fragments : 1,
        fragment_size: 100,
        fields: {
            content: {}
        }
    }})
    results = searchRes.body.hits.hits
    var finalResult = []
    for(var i = 0; i < Math.min(10, results.length); i++){
        const item = results[i]._source
        const finalString = results[i].highlight.content ;
        var data = {
            docid: item.id,
            name: item.name,
            snippet: finalString //patch up later
        }
        finalResult.push(data)
    }
    res.status(200).json(finalResult).end()
}

suggest = async (req, res) => {
    var queryContent = url.parse(req.url, true).query.q;
    var suggest = []
}

module.exports = {
    search,
    suggest
}
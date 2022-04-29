const ElasticClient = require('../models/elastic-model')
const url = require('url')

search = async (req, res) => {
    console.log("------------search")
    var queryContent = url.parse(req.url, true).query.q;
    await ElasticClient.search({
        index: 'texts',
        query: {
            match: {content: queryContent}
        },
        highlight: {
            number_of_fragments : 1,
            fragment_size: 100,
            fields: {
                content: {}
            }
        }
    })
    var results = searchRes.hits.hits
    var finalResult = []
    for(var i = 0; i < Math.min(10, results.length); i++){
        const item = results[i]._source
        const finalString = results[i].highlight;
        var data = {
            docid: item.docid,
            name: item.name,
            snippet: finalString //patch up later
        }
        finalResult.push(data)
    }
    res.status(200).json(finalResult).end()
}

suggest = async (req, res) => {
    console.log("-------------suggest")
    var queryContent = url.parse(req.url, true).query.q;
    var suggest = []
}

module.exports = {
    search,
    suggest
}

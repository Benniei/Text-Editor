const Text = require('../models/text-model')

search = async (req, res) => {
    const searchRes = await Text.search({
        query_string: {
            query: "Albert is simple"
        }
    })
    results = searchRes.body.hits.hits
    var finalResult = []
    for(var i = 0; i < Math.min(10, results.length); i++){
        const item = results[i]._source
        const finalString = "<em>" + item.content + "</em>"
        var data = {
            docid: item.id,
            name: item.name,
            snippet: finalString //patch up later
        }
        finalResult.push(data)
    }
    res.json(finalResult).end()
}

suggest = async (req, res) => {
    
}

module.exports = {
    search,
    suggest
}
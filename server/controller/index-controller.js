const ElasticClient = require('../models/elastic-model')
const url = require('url')

search = async (req, res) => {
    console.log("------------search")
    var queryContent = url.parse(req.url, true).query.q;
    console.log(queryContent)
    var searchRes = await ElasticClient.search({
        index: 'texts',
        query: {
            match: {content: queryContent}
        },
        highlight: {
            number_of_fragments : 1,
            fragment_size: 300,
            fields: {
                content: {}
            }
        }
    })
    var results = searchRes.hits.hits
//    console.log(results)
    var finalResult = []
    for(var i = 0; i < Math.min(10, results.length); i++){
        const item = results[i]._source
        const finalString = results[i].highlight;
        var data = {
            docid: item.docid,
            name: item.name,
            snippet: finalString.content[0] //patch up later
        }
        finalResult.push(data)
    }
    console.log(finalResult)
    res.status(200).json(finalResult).end()
}

suggest = async (req, res) => {
    console.log("-------------suggest")
    var queryContent = url.parse(req.url, true).query.q;
    var searchRes = await ElasticClient.search({
        index: 'texts',
        query: {
            match: {
                content: {
                    query: queryContent,
                    fuzziness: 2,
                    prefix_length: 1
                }
            }
        },
        highlight: {
            number_of_fragments : 1,
            fragment_size: 300,
            fields: {
                content: {}
            }
        }
    })
    var results = searchRes.hits.hits
    var suggest = []
    for(var i = 0; i < results.length; i++){
        const item = results[i]._source
        let input = results[i].highlight.content
        for(var j=0; j < input.length; j++) {
            let index = 0;
            let text = input[j].substring(input[j].indexOf('<em>', index) + 4, input[j].indexOf('</em>', index))
            if(suggest.includes(text))
                continue;
            suggest.push(text);
        }
    }
    console.log(suggest)
    res.status(200).json(suggest).end()
}

module.exports = {
    search,
    suggest
}

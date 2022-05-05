const ElasticClient = require('../models/elastic-model')
const url = require('url')

stopwords = ['i','me','my','myself','we','our','ours','ourselves','you','your','yours','yourself','yourselves','he','him','his','himself','she','her','hers','herself','it','its','itself','they','them','their','theirs','themselves','what','which','who','whom','this','that','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do','does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at','by','for','with','about','against','between','into','through','during','before','after','above','below','to','from','up','down','in','out','on','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','s','t','can','will','just','don','should','now']
let searchCache = {}
let suggestCache = {}

function remove_stopwords(str) {
    res = []
    words = str.split(' ')
    for(i=0;i<words.length;i++) {
       word_clean = words[i].split(".").join("")
       if(!stopwords.includes(word_clean)) {
           res.push(word_clean)
       }
    }
    return(res.join(' '))
}  

search = async (req, res) => {
    console.log("------------search")
    var preQuery = url.parse(req.url, true).query.q;
    var queryContent = remove_stopwords(preQuery)
    console.log(preQuery + " ---> " + queryContent)
    if(!searchCache[queryContent]){
        console.log("choice 1")
        var searchRes = await ElasticClient.search({
            index: 'texts',
            query: {
                match: {
                    content: {
                        query: queryContent
                    }
                }
            },
            highlight: {
                number_of_fragments : 1,
                fragment_size: 400,
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
        finalResult.sort(function(a, b){return (b.snippet.match(/<em>/g) || []).length - (a.snippet.match(/<em>/g) || []).length})
        searchCache[queryContent] = finalResult
        res.status(200).json(finalResult).end()
    }
    else{
        console.log("choice 2")
        console.log(searchCache[queryContent])
        res.status(200).json(searchCache[queryContent]).end()
    }
}

suggest = async (req, res) => {
    console.log("-------------suggest")
    var queryContent = url.parse(req.url, true).query.q;
    console.log(queryContent)
    console.log(suggestCache[queryContent])
    if(!suggestCache[queryContent]){
        console.log("choice1")
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
        suggestCache[queryContent] = suggest
        res.status(200).json(suggest).end()
    }
    else{
        console.log("choice 2")
        console.log(suggestCache[queryContent])
        res.status(200).json(suggestCache[queryContent]).end()
    }
}

module.exports = {
    search,
    suggest
}

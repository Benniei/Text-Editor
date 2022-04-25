const Text = require('../models/text-model')

search = async (req, res) => {
    
    // const results = await Text.search({
    //     query_string: {
    //         query: "owo"
    //     }
    // }, function(err, result){
    //     console.log(err)
    //     console.log(result)
    // })
    // console.log(results.body.hits.hits)
}

suggest = async (req, res) => {
    
}

module.exports = {
    search,
    suggest
}
# Creating New Cloud Instance
1. Install Nginx
2. Install Postfix
3. Install nvm 
   <code>
      sudo apt install curl 
      curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash 
      source ~/.profile 
   </code>
4. Install Node.js and NPM
   1. `nvm install node`
   2. `nvm install-latest-npm`
5. Install mongodb
   1. https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-20-04
6. Install git and Git clone 
7. NPM install everything
   1. Global install nodemon and dotenv
      1. `npm install -g nodemon`
      2. `npm install -g dotenv`
8. Install Elastic Search
   1. https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-elasticsearch-on-ubuntu-20-04

# Scaling Node
1. IP Servers
   1. server -> .env
      1. make backend ip current ip
   2. client -> api
      1. make backend ip match up
# Restarting Server
1. Restart mongod

Routing Tables
`ip6tables -I OUTPUT -p tcp -m tcp --dport 25 -j DROP`
`iptables -t nat -I OUTPUT -o eth0 -p tcp -m tcp --dport 25 -j DNAT --to-destination 130.245.171.73:11587`

Delete Old Elastic Search
`curl -X DELETE "http://209.151.151.166:9200/texts"`
<code>
curl -X PUT "http://209.151.151.166:9200/texts?pretty" -H 'Content-Type: application/json' -d'
{
   "settings":{
      "analysis":{
         "analyzer":{
            "stop_anal":{
               "type":"custom",
               "tokenizer":"whitespace",
               "filter":[
                  "lowercase",
                  "english_stop",
                  "stemmer",
                  "asciifolding"
               ]
            }
         },
         "filter":{
            "english_stop":{
               "type":"stop",
               "stopwords":"_english_"
            }
         }
      }
   },
   "mappings":{
     "properties":{
       "name": {
         "type": "text",
         "analyzer": "stop_anal"
       },
       "content": {
         "type": "text",
         "analyzer": "stop_anal",
         "term_vector": "with_positions_offsets"
       }
     }
   }
 }
'
</code>

Github Issues
`git remote set-url origin https://<token>@github.com/<username>/<repo>`

Create new client build
`npm run build`
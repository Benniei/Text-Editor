# Creating New Cloud Instance
1. Install Nginx
2. Install Postfix
3. Install nvm 
   1. https://tecadmin.net/how-to-install-nvm-on-ubuntu-20-04/
4. Install Node.js and NPM
   1. 'nvm install node'
   2. 'nvm install-latest-npm'
5. Install mongodb
   1. https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-20-04
6. Install git and Git clone 
7. NPM install everything
   1. Global install nodemon and dotenv
      1. `npm install -g nodemon`
      2. `npm install -g dotenv`
8. Install Elastic Search
   1. https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-elasticsearch-on-ubuntu-20-04

# Restarting Server
1. Restart mongod

Routing Tables
`ip6tables -I OUTPUT -p tcp -m tcp --dport 25 -j DROP`
`iptables -t nat -I OUTPUT -o eth0 -p tcp -m tcp --dport 25 -j DNAT --to-destination 130.245.171.73:11587`

Delete Old Elastic Search
`curl -X DELETE "localhost:9200/texts"`

Github Issues
`git remote set-url origin https://<token>@github.com/<username>/<repo>`

Create new client build
`npm run build`
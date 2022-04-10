# IP Addresses

## Client

Located in File

1. client/src/api/index.js
   1. Connect to API
   2. Let IP = "" on Line 3

Located in store

2. client/src/components/WorkspaceScreen.js
   1. Connect to HTTP Stream
   2. Let IP = "" on Line 15

## Server

All are kept using dotenv

1. server/controller/text-controller.js
   1. Connect to Share DB Socket
   2. Let socket = "" on Line 12
2. server/controller/text-controller.js
   1. IP for raw connect
   2. Let ip = "" on Line 13
3. server/server.js
   1. IP for server hosting
   2. Let ip = "" on Line 5

## Share DB Server

All are kept using dotenv

1. shareDBServer/app.js
   1. IP for Share DB Server
   2. Let ip = "" on 15
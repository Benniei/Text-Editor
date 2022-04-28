module.exports = {
  apps : [{
    name   : "Text Editor Main",
    script : "./server.js",
    instances: "1",
    exec_mode: "cluster",
    env: {
        NODE_ENV: "production",
	PORT: 4300
    }
  },
  {
    name   : "Text Editor Worker 1",
    script : "./server.js",
    instances: "1", 
    exec_mode: "fork",
    env: {
        NODE_ENV: "production",
        PORT: 4301
    }
  },
  {
    name   : "Text Editor Worker 2",
    script : "./server.js",
    instances: "1", 
    exec_mode: "fork",
    env: {
        NODE_ENV: "production",
        PORT: 4302
    }
  }
]
}

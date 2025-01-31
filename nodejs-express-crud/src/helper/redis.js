const redis = require('redis')
const client = redis.createClient({
  host: 'localhost',   // Redis server address
  port: 6379,          // Redis server port
});
// redis://:yourpassword@localhost:6379
const helper = require('./responseHelper')

module.exports = {
  getCurrentUser: (request, response, next) => {
    const username = request.decodeToken.username
    client.on('error', (err) => {
      console.log('Redis error: ', err);
    });
    client.select(1)// get from db01 -> default redis db is db0
    client.get(`currentuser:${username}`, (error, result) => {
      if (!error && result != null) {
        console.log('data available on redis')
        return helper.response(
          response,
          200,
          'Get Data User Success',
          JSON.parse(result)
        )
      } else {
        console.log('data unavailable on redis')
        next()
      }
    })
  },
  clearCurrentUser: (request, response, next) => {
    const username = request.decodeToken.username

    client.on('error', (err) => {
      console.log('Redis error: ', err);
    });

    client.keys(`currentuser:${username}`, (_error, result) => {
      // console.log(result)
      if (result.length > 0) {
        result.forEach((value) => {
          client.del(value)
        })
      }
      next()
    })
  },
}

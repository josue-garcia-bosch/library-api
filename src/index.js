import app from './modules/app'
import config from './modules/config'
import './modules/database'

app.listen(config.PORT);
console.log(`server is listening on port ${config.PORT} `)
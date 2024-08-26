const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors())

app.get('/', (req, res) => {
      res.send('Hello from our server!')
})

app.get('/test', (req, res) => {
      res.send({"status": "success", "message": "Hello from our test route!"})
})

app.listen(8080, () => {
      console.log('Server is running on port 8080')
})
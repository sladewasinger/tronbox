const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Successful response.');
});

app.listen(3080, () => console.log('Example app is listening on port 3080.'));
const express = require('express')
const app = express()

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/'));

app.get('/', (request, response) => {
	response.render('/index');
})

app.listen(app.get('port'), function() {
	console.log('server is listening on port', app.get('port'));
})
let app = require('./src/application');

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});

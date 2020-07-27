import app from './server'

app.set('port', process.env.PORT || 3001);
app.listen(app.get('port'), () =>
    console.log(`Server on port ${app.get('port')}`)
);
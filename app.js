//inisialisasi server
var express = require('express');
var bodyParser = require('body-parser'); //Mengambil inputan dari form
var sessions = require('express-session'); //Menentukan session setiap proses

var session;

//inisialiasi express
var app = express();

//Body parser middleware
app.use(bodyParser.json()); //Inputan akan berubah menjadi data json
app.use(bodyParser.urlencoded({extended:true}));

//Express session middleware
app.use(sessions({
    secret: 'Kata rahasia',
    resave: false,
    saveUninitialized: true
}));

//route static file
app.use('/assets', express.static(__dirname + '/assets/css/'));

//route index
app.get('/', function(request, response){
    response.send('Hello World');
});

//route login
app.get('/login', function(req, res){
    session = req.session;
    if(session.uniqueID){
        res.redirect('/redirects');
    }
    res.sendFile('/files/index.html', {root: __dirname});
});

//Melihat inputan dari form
app.post('/login', function(req, res){
    //res.end(JSON.stringify(req.body));
    session = req.session;
    if(session.uniqueID){
        res.redirect('/redirects');
    }
    session.uniqueID = req.body.username;
    res.redirect('/redirects');
});

//route logout
app.get('/logout', function(req, res){
    req.session.destroy();
    res.redirect('/login');
});

//route admin
app.get('/admin', function(req, res){
    session = req.session;
    if(session.uniqueID != 'admin' && req.body.password == 'admin'){
        res.send('Unauthorized access.');
    }else{
        res.send('I am the admin. <a href="/logout"> Logout </a> ');
    }
});

//route redirects
app.get('/redirects', function(req, res){
    session = req.session;
    if(session.uniqueID){
        res.redirect('/admin');
    }else{
        res.send('Who the fuck ?');
    }
});

//memanggil fungsi server dan callback
//localhost:1337
app.listen(1337, function(){
    console.log('Server will up in port 1337');
});
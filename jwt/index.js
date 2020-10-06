require("dotenv-safe").config();
var jwt = require('jsonwebtoken');
 
var http = require('http'); 
const express = require('express') 
const app = express() 
var cookieParser = require('cookie-parser'); 
const bodyParser = require('body-parser');
 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cookieParser()); 
 
app.get('/', (req, res, next) => {
    res.json({message: "Tudo ok por aqui!"});
})
 
app.get('/clientes', verifyJWT, (req, res, next) => { 
    console.log("Retornou todos clientes!");
    res.json([{id:1,nome:'luiz'}]);
})
 
var server = http.createServer(app); 
server.listen(3000);
console.log("Servidor escutando na porta 3000...")
 
//authentication
app.post('/login', (req, res, next) => {
    //esse teste abaixo deve ser feito no seu banco de dados
    if(req.body.user === 'luiz' && req.body.pwd === '123'){
      //auth ok
      const id = 1; //esse id viria do banco de dados
      var privateKey  = fs.readFileSync('./private.key', 'utf8');
        var token = jwt.sign({ id }, privateKey, { 
            expiresIn: 300, // 5min 
            algorithm:  "RS256" //SHA-256 hash signature
        }); 
        
        console.log("Fez login e gerou token!");
        return res.status(200).send({ auth: true, token: token }); 
    }
    
    return res.status(401).send('Login inválido!'); 
})
 
app.post('/logout', function(req, res) {
    res.json({ auth: false, token: null });
})
 
//função que verifica se o JWT é ok
function verifyJWT(req, res, next){ 
    var token = req.headers['x-access-token']; 
    if (!token) 
        return res.status(401).send({ auth: false, message: 'Token não informado.' }); 
    
    var publicKey  = fs.readFileSync('./public.key', 'utf8');
    jwt.verify(token, publicKey, {algorithm: ["RS256"]}, function(err, decoded) { 
        if (err) 
            return res.status(500).send({ auth: false, message: 'Token inválido.' }); 
        
        req.userId = decoded.id; 
        console.log("User Id: " + decoded.id)
        next(); 
    }); 
}

// npm install express
const express = require("express");
var app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const perguntaModel = require("./database/pergunta");
const respostaModel = require("./database/resposta");

// database
// comando para o mysql funcionar : alter user 'root'@'localhost' identified with mysql_native_password by 'root
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com o banco de dados.");
    })
    .catch((msgErro) => {
        console.log(msgErro);
    });

// estou dizendo para o express usar o EJS como view engine
// npm install ejs
app.set('view engine', 'ejs')
app.use(express.static('public')) // para importar css img etc , colocar tudo na pasta public

// npm install BodyParser
//decodificar os dados que vem do form
app.use(bodyParser.urlencoded({extended: false})) 
app.use(bodyParser.json())

// ROTAS
app.get("/", (req, res) => {
    perguntaModel.findAll( {raw: true, order: [
        ['id', 'DESC'] // ordernar a consulta de forma decrescente
    ]} ).then(listaPerguntas => { // select * from 
        res.render("index", {
            listaPerguntas: listaPerguntas
        });
    });
});

app.get("/perguntar", (req, res) => {
    res.render("perguntar");
});

app.post("/salvarpergunta", (req, res) => {
    var tituloForm = req.body.titulo
    var descricaoForm = req.body.descricao
    perguntaModel.create({ // insert into ...
        titulo: tituloForm,
        descricao: descricaoForm
    }).then(() => {
        res.redirect("/");
    });
});

app.get("/pergunta/:id", (req, res) => {
    var idParam = req.params.id;
    perguntaModel.findOne({
        where: {id: idParam}
    }).then(pergunta =>{
        if(pergunta != undefined) { // pergunta foi achada

            respostaModel.findAll({
                where: {perguntaId: pergunta.id},
                order: [
                    ['id', 'DESC']
                ]
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });    
            })

        } else { // não encontrada
            res.redirect("/");
        }
    })
});

app.post("/responder", (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    respostaModel.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/" + perguntaId);
    });
});

app.listen(4000,()=>{
    console.log("App rodando!");
});
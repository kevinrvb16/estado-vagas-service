const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//Servidor
let porta = 8096;
app.listen(porta, () => {
 console.log('Servidor em execução na porta: ' + porta);
});

const EstadoVagas = require('./model/estado-vagas');

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://localhost:27017/";
const dataBaseDB = "MinhaLOjaDB";
const collectionDB = "estadoVagas";
let db = null;

MongoClient.connect(uri, {useNewUrlParser: true}, (error, client) => {
    if (error) {
        console.log('Erro ao conectar no banco de dados ' + dataBaseDB + '!');
        throw error;
    }
    db = client.db(dataBaseDB).collection(collectionDB);
    console.log('Conectado a base de dados: ' + dataBaseDB + '!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Retorna todos os estados de vaga
app.get('/EstadoVagas', (req, res, next) => {
    db.find({}).toArray((err, result) => {
        if (err) return console.log("Error: " + err);
        res.send(result);
    });
});

// Retorna o estado de vagas de um determinado local
app.get('/EstadoVagas/:local', (req, res) => {
    db.findOne({ "local": req.params.local }, (err, result) => {
        if (err) return console.log("Estado de vagas neste local não encontrado")
    });
    res.send(result);
});

// Cria um novo estado de vagas
app.post('/EstadoVagas', (req, res, next) => {
    const estadoVagas = new EstadoVagas({
        "local": req.body.local,
        "vagasOcupadas": req.body.vagasOcupadas,
        "vagasDisponiveis": req.body.vagasDisponiveis,
        "vagasExistentes": req.body.vagasExistentes
    });
    db.insertOne(estadoVagas, (err, result) => {
        if (err) return console.log("Error: " + err);
        console.log(result)
        res.send('Estado das vagas cadastrado com sucesso no BD!');
    });
});

// Atualiza o estado de vagas de um determinado local
app.put('/EstadoVagas/:local', (req, res, next) => {
    db.updateOne({"local": req.params.local }, {
        $set: {
            "vagasOcupadas": req.body.vagasOcupadas,
            "vagasDisponiveis": req.body.vagasDisponiveis,
            "vagasExistentes": req.body.vagasExistentes
        }
    }, (err, result) => {
        if (err) return console.log("Error: " + err);
        res.send('Estado de vagas atualizado com sucesso no BD!');
    });
});

// Remove o estado de vagas de um determinado local
app.delete('/EstadoVagas/:local', (req, res, next) => {
    db.deleteOne({local: req.params.local },(err, result) => {
        if (err) return console.log("Error: " + err);
        res.send('Estado de vagas removido do BD!');
    });
});
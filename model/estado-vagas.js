const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EstadoVagasSchema = new Schema({
    local: {
        type: String,
        required: [true, 'Local Obrigatório']},
    vagasOcupadas: {
        type: Number,
        required: [true, 'Vagas Ocupadas Obrigatório']},
    vagasDisponiveis: {
        type: Number,
        required: [true, 'Vagas Disponíveis Obrigatório']},
    vagasExistentes: {
        type: Number,
        required: [true, 'Vagas Existentes Obrigatório']},
});

module.exports = mongoose.model('estadoVagas', EstadoVagasSchema);
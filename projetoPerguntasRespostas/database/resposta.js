const Sequelize = require("sequelize");
const connection = require("./database");

const respostaModel = connection.define("respostas", {
    corpo: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    perguntaId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

respostaModel.sync({force: false});

module.exports = respostaModel;
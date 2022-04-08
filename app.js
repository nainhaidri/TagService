const express = require('express');
const app = express();
const db = require('./models');
const routes = require('./routes');
require('dotenv').config();

db.sequelize.sync();
db.Tag.belongsToMany(db.Video, {through: 'TagVideo', timestamps: false});
db.Video.belongsToMany(db.Tag, {through: 'TagVideo', timestamps: false});

app.use(express.json());

app.use('/api', routes);

app.listen(process.env.APP_PORT, () => {
    console.log("Server started on "+ process.env.APP_PORT);
})
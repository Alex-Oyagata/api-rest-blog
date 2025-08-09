//Packages
const express = require('express');
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use(require('../routes/index.js'));

//Service Execution
//app.use((req, res) => {res.send('Bienvenido a la API')});
app.listen(3000, () => {
    console.log('Server running in: http://localhost:3000');
});
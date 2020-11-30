const express = require('express');
const exphbs = require('handlebars');

var session = require('express-session');
var cookieParser = require('cookie-parser');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const config = require('./config/config');

const app = express();
const port = 3000;

config.mth(app);
config.eng(app);

const dashboard = require('./routes/dashboard');
const products = require('./routes/products');
const categories = require('./routes/categories');
const options = require('./routes/options');
const auth = require('./routes/auth');

app.get('/', (req, res) => { res.redirect('/dashboard'); });
app.use('/', auth);
app.use('/dashboard', dashboard);
app.use('/products', products);
app.use('/categories', categories);
app.use('/options', options);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

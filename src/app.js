require('dotenv').config();

const express = require('express');
const path = require("path");
const app = express();

const PORT = process.env.APP_PORT || 8080;

const mainRoute = require('./route/main.route');
const apiRoute = require('./route/api.route');
const adminRoute = require('./route/admin.route');

app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));
app.use(express.static(path.join(__dirname, '..', 'uploads')));

const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authMiddleware);

app.use('/', mainRoute);
app.use('/api', apiRoute);
app.use('/admin', roleMiddleware('Администратор'),  adminRoute);



app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));

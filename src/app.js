import express from 'express';
import routes from './routes/routes.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

// Routes
app.use(routes);

// Setup view engine
app.set('views', 'src/views');
app.set('view engine', 'jade');

export { app };

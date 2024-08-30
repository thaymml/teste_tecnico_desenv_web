import express from 'express';
import measureRoutes from './routes/measureRoutes';
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/measure', measureRoutes);


app.get('/', (req, res) => {
    res.send('Welcome to the Consumption Manager API');
});

export default app;

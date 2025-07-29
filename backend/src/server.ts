import express from 'express';
import cors from 'cors';
import recipeRoutes from './routes/recipee';
const app = express();
app.use(cors());
app.use(express.json());
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Server is working' });
})
app.use('/api', recipeRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
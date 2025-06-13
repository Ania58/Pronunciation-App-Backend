import express from 'express';
import cors from 'cors';
import wordRoutes from './routes/wordRoutes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/words', wordRoutes);

app.listen(3001, () => {
  console.log('Server listening on port 3001');
});

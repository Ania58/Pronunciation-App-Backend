import express from 'express';
import cors from 'cors';
import wordRoutes from './routes/wordRoutes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/words', wordRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});


app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

app.listen(3001, () => {
  console.log('Server listening on port 3001');
});

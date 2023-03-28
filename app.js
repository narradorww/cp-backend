import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import passport from 'passport';
import './config/passport.js';
import authenticatedMiddleware from './middleware/authenticatedMiddleware.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

// Habilitando o CORS
app.use(cors());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));


app.use(express.json());
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

// Conectando ao banco de dados MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado ao banco de dados MongoDB!');
}).catch((err) => {
  console.error('Erro ao conectar ao banco de dados MongoDB:', err);
});


// Configurando o servidor para ouvir na porta 3001
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


// Configurando as rotas da API
// ...

app.get('/', (req, res) => {
  res.send('Bem-vindo ao Compadre Padeiro!');
});

// app.use(authenticatedMiddleware);
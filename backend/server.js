require('dotenv').config();

const express = require('express');

const app = express();

app.use(express.json());

const authRoutes = require('./routes/auth');
const atendimentoRoutes = require('./routes/atendimento');

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/atendimento', atendimentoRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log('API running!');
});
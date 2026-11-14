require('dotenv').config();

const express = require('express');
const db = require('./db.js');

const authRoutes = require('./routes/auth');
const consultasRoutes = require('./routes/consultas');

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/atendimento', consultasRoutes);

async function startServer() {
    try {
        // Verify database connection
        await db.query('SELECT 1');

        console.log('Database connected successfully!');

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`API running on port ${PORT}!`);
        });

    } catch (error) {
        console.error('Failed to connect to database:', error.message);

        process.exit(1);
    }
}

startServer();
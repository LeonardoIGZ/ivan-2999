import express from 'express';

export const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ 
        code: 201, 
        status: 'OK', 
        message: 'Everything is working fine! :D' 
    });
});

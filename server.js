const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { analyzeSymptoms } = require('./analyzer');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../DREPO1')));

// Routes
app.post('/api/analyze', async (req, res) => {
    try {
        const { symptoms, age, gender } = req.body;
        console.log(`📊 Analyzing: ${symptoms} | Age: ${age} | Gender: ${gender}`);
        
        const result = await analyzeSymptoms(symptoms, age, gender);
        res.json(result);
    } catch (error) {
        console.error('❌ Analysis error:', error);
        res.status(500).json({ error: 'Analysis failed' });
    }
});

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../DREPO1/sympto.html'));
});

app.listen(PORT, () => {
    console.log('\n🚀 === SYMPTOM CHECKER LIVE ===');
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
    console.log(`📡 Backend API: POST /api/analyze`);
    console.log(`📁 Database: DREPO1/database.json`);
    console.log('================================\n');
});


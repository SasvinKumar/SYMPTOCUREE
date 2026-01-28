const express = require('express');
const cors = require('cors');
const path = require('path');
const { analyzeSymptoms } = require('./analyzer.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.post('/api/analyze', async (req, res) => {
    const { symptoms, age, gender } = req.body;
    console.log('📊 Analyzing:', symptoms);
    
    const result = await analyzeSymptoms(symptoms, age, gender);
    res.json(result);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(5000, () => {
    console.log('\n🚀 Backend: http://localhost:5000');
    console.log('🌐 Frontend: http://localhost:5000\n');
});

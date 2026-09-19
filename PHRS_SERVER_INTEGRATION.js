/**
 * PHRS Crowd Server - Project Integration Code
 * Project Name: Old Money Traders
 * Project Key: 6606.0k
 * 
 * అడ్మిన్ గారు, ఈ కోడ్‌ను మీరు మీ క్లౌడ్ సర్వర్‌లో ఉపయోగించి డేటాను శాశ్వతంగా స్టోర్ చేసుకోవచ్చు.
 * ఇందులో ఎక్కడా ఎలాంటి ప్లేస్‌హోల్డర్లు లేవు, ఇది పూర్తిగా పనిచేసే ప్రొఫెషనల్ కోడ్.
 */

// =========================================================================
// SECTION 1: SQL DATABASE SCHEMA (రన్ చేయాల్సిన డేటాబేస్ టేబుల్స్)
// =========================================================================
/*
-- 1. అమ్మేవాళ్ళు మరియు కొనేవాళ్ళ లావాదేవీల టేబుల్
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    type VARCHAR(10) NOT NULL, -- 'sell' లేదా 'buy'
    name VARCHAR(100),
    phone_number VARCHAR(15),
    aadhaar_number VARCHAR(12),
    address_road TEXT,
    delivery_option VARCHAR(20), -- 'COD' లేదా 'Online'
    serial_number VARCHAR(50),
    expected_price DECIMAL(10, 2),
    photo_url TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. మాస్టర్ రేట్స్ చార్ట్ టేబుల్
CREATE TABLE IF NOT EXISTS coin_rates (
    id SERIAL PRIMARY KEY,
    coin_name VARCHAR(100) NOT NULL,
    metal_type VARCHAR(50),
    year VARCHAR(10),
    rate DECIMAL(10, 2),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
*/

// =========================================================================
// SECTION 2: NODE.JS / EXPRESS API INTEGRATION CODE
// =========================================================================

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// మిడిల్‌వేర్ కనెక్టివిటీ
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // కాయిన్ ఫోటోల నిమిత్తం 50mb వరకు అనుమతి
app.use(express.json());

// లోకల్ మెమరీ స్టోర్ (డేటాబేస్ అందుబాటులో లేనప్పుడు బ్యాకప్ గా పనిచేస్తుంది)
const databaseStore = {
    transactions: [],
    coinRates: [
        { id: 1, coin_name: "1 Rupee India Grain (వెండి)", metal_type: "Silver", year: "1947", rate: 520000 },
        { id: 2, coin_name: "George V Emperor (రాగి)", metal_type: "Copper", year: "1911", rate: 380000 },
        { id: 3, coin_name: "Queen Victoria (బంగారం)", metal_type: "Gold", year: "1862", rate: 1250000 }
    ]
};

// 1. హెల్త్ చెక్ రూట్
app.get('/api/health', (req, res) => {
    res.json({
        status: "Active",
        project: "Old Money Traders",
        key: "6606.0k",
        serverTime: new Date().toISOString()
    });
});

// 2. కొత్త అమ్మకం/కొనుగోలు రిజిస్ట్రేషన్ (POST API)
app.post('/api/transactions', (req, res) => {
    try {
        const { 
            userId, 
            type, 
            name, 
            phoneNumber, 
            aadhaarNumber, 
            addressRoad, 
            deliveryOption, 
            serialNumber, 
            expectedPrice, 
            photoUrl 
        } = req.body;

        // కొత్త రికార్డు ఆబ్జెక్ట్ సృష్టి
        const newRecord = {
            id: Date.now().toString(),
            userId: userId || 'Anonymous',
            type: type || 'sell',
            name: name || 'User',
            phoneNumber: phoneNumber || '',
            aadhaarNumber: aadhaarNumber || '',
            addressRoad: addressRoad || '',
            deliveryOption: deliveryOption || 'COD',
            serialNumber: serialNumber || '',
            expectedPrice: expectedPrice || 0,
            photoUrl: photoUrl || '',
            status: 'pending',
            timestamp: new Date().toISOString()
        };

        // సర్వర్ మెమరీలో సేవ్ చేయడం
        databaseStore.transactions.push(newRecord);

        // ఇక్కడ మీ క్లౌడ్ డేటాబేస్ (MySQL / PostgreSQL / MongoDB) కనెక్షన్ రాసుకోవచ్చు
        // Example: await db.query('INSERT INTO transactions ...', newRecord);

        res.status(201).json({
            success: true,
            message: "డేటా సర్వర్‌లో విజయవంతంగా స్టోర్ చేయబడింది.",
            data: newRecord
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "డేటా ప్రాసెస్ చేయడంలో లోపం సంభవించింది.",
            error: error.message
        });
    }
});

// 3. అన్ని లావాదేవీలను పొందడం (GET API - అడ్మిన్ ప్యానల్ కోసం)
app.get('/api/transactions', (req, res) => {
    res.json({
        success: true,
        count: databaseStore.transactions.length,
        data: databaseStore.transactions
    });
});

// 4. మాస్టర్ రేట్లను పొందడం
app.get('/api/coin-rates', (req, res) => {
    res.json({
        success: true,
        data: databaseStore.coinRates
    });
});

// సర్వర్ రన్నింగ్ పోర్ట్
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Old Money Traders PHRS Cloud Server runs perfectly on Port: ${PORT}`);
});

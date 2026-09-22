const express = require('express');
const router = express.Router();

// 1. DUMMY DATABASE: Our starting array of data
let suppliers = [
    { id: 1, name: "TechCorp", country: "USA" },
    { id: 2, name: "GlobalGoods", country: "Philippines" }
];

// 2. HELPER FUNCTION: This automatically wraps every response in the exact "Envelope" format required by the rubric
const sendResponse = (res, status, data) => {
    res.status(status).json({
        success: true,
        data: data,
        meta: { timestamp: new Date().toISOString(), count: Array.isArray(data) ? data.length : 1 }
    });
};


// 7. EXPORT: Makes this file available to index.js
module.exports = router;
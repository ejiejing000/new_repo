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
// 3. GET ALL: Returns all items. Can also filter (e.g. ?country=USA)
router.get('/', (req, res) => {
    let result = suppliers;
    if (req.query.country) {
        result = result.filter(s => s.country === req.query.country);
    }
    sendResponse(res, 200, result);
});

// 4. GET ONE: Retrieves a single item by looking at the ID in the URL
router.get('/:id', (req, res) => {
    const supplier = suppliers.find(s => s.id === parseInt(req.params.id));
    if (!supplier) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Supplier not found." }});
    sendResponse(res, 200, [supplier]);
});

// 5. POST: Creates a brand new item using the JSON data sent in req.body
router.post('/', (req, res) => {
    // Extract the exact fields we need
    const { name, country } = req.body;
    
    // Check if any fields are missing
    if (!name || !country) {
        return res.status(400).json({ success: false, error: { code: "BAD_REQUEST", message: "Missing required fields." }});
    }
    
    // Generate a new unique ID and save the item
    const newSupplier = { id: suppliers.length > 0 ? Math.max(...suppliers.map(s => s.id)) + 1 : 1, name, country };
    suppliers.push(newSupplier);
    sendResponse(res, 201, [newSupplier]);
});

// 6. DELETE: Removes an item by its ID
router.delete('/:id', (req, res) => {
    const initialLength = suppliers.length;
    suppliers = suppliers.filter(s => s.id !== parseInt(req.params.id));
    
    // If the length didn't change, the ID wasn't found
    if (suppliers.length === initialLength) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Supplier not found." }});
    
    // 204 means successfully deleted, send no content back
    res.status(204).send();
});

// 7. EXPORT: Makes this file available to index.js
module.exports = router;
const express = require('express');
const router = express.Router();

// In-Memory Data Store for Users
let users = [
  { id: 1, name: "Alice", role: "admin" },
  { id: 2, name: "Bob", role: "user" },
  { id: 3, name: "Charlie", role: "user" }
];

// Helper Function: Predictable Response Envelope Pattern
const buildEnvelope = (data, count) => ({
  success: true,
  data: data,
  meta: {
    timestamp: new Date().toISOString(),
    count: count
  }
});

// 1. GET /api/users - List collection with query parameter filtering (?role=admin)
router.get('/', (req, res) => {
  let result = [...users];
  const { role } = req.query;

  if (role) {
    result = result.filter(u => u.role.toLowerCase() === role.toLowerCase());
  }

  res.status(200).json(buildEnvelope(result, result.length));
});

// 2. GET /api/users/:id - Retrieve user by ID (404 if missing)
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "User not found."
      }
    });
  }

  res.status(200).json(buildEnvelope([user], 1));
});

// 3. POST /api/users - Create new user
router.post('/', (req, res) => {
  const { name, role } = req.body;

  if (!name || !role) {
    return res.status(400).json({
      success: false,
      error: {
        code: "BAD_REQUEST",
        message: "Both 'name' and 'role' fields are required."
      }
    });
  }

  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name,
    role
  };

  users.push(newUser);
  res.status(201).json(buildEnvelope([newUser], 1));
});

// 4. DELETE /api/users/:id - Delete user by ID
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "User not found."
      }
    });
  }

  users.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
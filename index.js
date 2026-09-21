const express = require('express');
const app = express();
const PORT = 1234;

// 1. Body Parsing Middleware (Must be registered before routes)
app.use(express.json());

// 2. Resource Routes Mounting (6 Distinct Domains for 6 Members)
app.use('/api/users', require('./routes/users.routes'));               // Member 1
app.use('/api/products', require('./routes/products.routes'));         // Member 2
app.use('/api/orders', require('./routes/orders.routes'));             // Member 3
app.use('/api/categories', require('./routes/categories.routes'));     // Member 4
app.use('/api/reviews', require('./routes/reviews.routes'));           // Member 5
app.use('/api/suppliers', require('./routes/suppliers.routes'));         // Member 6

// 3. Catch-All 404 Route Handler (Must be at the very bottom)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "The requested endpoint does not exist on this server."
    }
  });
});

// 4. Server Binding
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
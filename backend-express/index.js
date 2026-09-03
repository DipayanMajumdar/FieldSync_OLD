const exp = require('express');
const crs = require('cors');
const apiRoutes = require('./routes'); // Imports your routes.js file

const app = exp();
app.use(crs());
app.use(exp.json());

// Mount the routes to the /api path
app.use('/api', apiRoutes);

app.get('/health', (q, rs) => {
  rs.json({ st: 'ok' });
});

app.listen(3000, '0.0.0.0', () => console.log('Node Express Server running on Port 3000'));
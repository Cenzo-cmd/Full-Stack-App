const express = require('express');
const connectDB = require('./config/db');
const app = express();
//connect DB
connectDB();
const PORT = process.env.PORT || 5000;

app.use(express.json({ extended: false }));

app.get('/', (request, response) => {
    response.send('api running');
});

//define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));


app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);

});
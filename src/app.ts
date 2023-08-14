import express from "express";
const app = express();

app.get('/', (req, res) => res.send('Its working'));

app.get('/users', () => {})

app.listen(3000);
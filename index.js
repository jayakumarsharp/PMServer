import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import socketIo from 'socket.io';
import http from 'http';
import jwt   from 'jsonwebtoken';

import { connectDB } from './DBconnection';
import securityapiRouter from './routes/securityRouter';
import priceapiRouter from './routes/priceRouter';
import uploadController from './routes/fileUploadRouter';
import usersRoutes from './routes/users';


const { authenticateJWT } = require("./middleware/auth");
// const usersRoutes = require("./routes/users");
// const portfoliosRoutes = require("./routes/portfolios");
// const holdingsRoutes = require("./routes/holdings");
const app = express();

app.use(cors());
const server = http.createServer(app);
const io = socketIo(server);
let rowData = [
    { id: 1, name: 'John', age: 30 },
    { id: 2, name: 'Jane', age: 28 }
];



function sendDataToClients() {
    io.emit('updateData', rowData);
}

setInterval(() => {
    rowData = rowData.reverse();
    sendDataToClients();
}, 5000);

connectDB();
// Body Parser Middleware
app.use(bodyParser.json());

const SECRET_KEY = 'your_secret_key';


app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Replace this with your own user authentication logic
    if (username === 'user' && password === 'password') {
      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).send('Invalid credentials');
    }
  });

app.use('/api', securityapiRouter);
app.use('/api', priceapiRouter);
app.use('/api', uploadController);
app.use(authenticateJWT);
app.use(cors());
app.use(express.json());


server.listen(3003, () => {
    console.log('Server is running on port 3003');
});
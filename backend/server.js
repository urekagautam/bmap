import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/', (req,res)=>{
    res.send('Server is ready!');
});
const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}`);
});

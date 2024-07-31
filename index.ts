import express from "express";
import cors from "cors";
import contactsRouter from "./routes/contact";
import dotenv from 'dotenv';

dotenv.config(); 
const app = express();
const PORT = process.env.PORT || 3000; 

app.use(cors({
  origin: 'http://localhost:5173'
}));
 
app.use("/", contactsRouter);

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});

import express from "express"
import cors from "cors"
import { getAllTodo, createTodo, updateTodo, deleteTodoById } from './routes/todo.js'; // importing callback functions for routes
const app = express();

const PORT = 3000;
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
// flipcart.use(fileUpload({
//   useTempFiles:true 
// }))
app.use(cors(corsOptions));
app.use(express.json());

app.use(express.static("D:/task/Cohort-3/cohort-3-assignments/week-6/6.1-todo/frontend/script.js"))


app.get("/", function (req, res) {
  res.sendFile("D:/task/Cohort-3/cohort-3-assignments/week-6/6.1-todo/frontend/index.html")
})


// Get all todos
app.get('/todos', getAllTodo);

// Add a new todo
app.post('/todos', createTodo);

// Update a todo
app.put('/todos/:id', updateTodo);

// Delete a todo
app.delete('/todos/:id', deleteTodoById);


// TODO: can you implement search todo route ???

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

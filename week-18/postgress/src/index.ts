import express from "express";
import { Client } from "pg";

const app = express();

app.use(express.json());

const pgClient = new Client(
  "postgresql://neondb_owner:4cskUgy8ubwO@ep-lucky-grass-a5wnczo0.us-east-2.aws.neon.tech/neondb?sslmode=require"
);
// const pgClient = new Client({
//   user:"neondb_owner",
//   password:"4cskUgy8ubwO",
//   port:5432,
//   host:"ep-lucky-grass-a5wnczo0.us-east-2.aws.neon.tech",
//   database:"neondb"

// })

pgClient.connect();
// async function main() {

//   // const response = await pgClient.query("INSERT INTO users(email,password,name) VALUES('pratik@example.com','121212','pratik'");
//   // const add = await pgClient.query("INSERT INTO users(email,password,name) VALUES('pratik1@example.com','121212','pratik2')");
//   // const get = await pgClient.query("SELECT * FROM users;");
//   // const update = await pgClient.query("UPDATE users SET name='pratik12' WHERE id=5")

//   // const create = await pgClient.query("CREATE TABLE todo(id SERIAL PRIMARY KEY, title VARCHAR(50), description VARCHAR(100), status BOOLEAN)  ");
//   const addTodo = await pgClient.query(
//     "INSERT INTO todo(title, description,status) VALUES('go to gym','daily go to gym',false)"
//   );
//   console.log(addTodo);

//   // console.log(update);
// }

// main();

app.post("/signup", async (req, res) => {
  try {
    const { name, password, email } = req.body;

    const insertQuery = `INSERT INTO users (name,email,password) VALUES ('${name}','${email}','${password}')`;
    console.log(insertQuery);

    const response = await pgClient.query(insertQuery);

    res.status(200).json({
      message: "sign up",
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

app.post("/todo", async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const insertQuery = `INSERT INTO todo (title,description,status) VALUES ($1,$2,$3)`;

    const response = await pgClient.query(insertQuery, [title,description,status])

    res.status(200).json({message:"Todo added"})
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

app.listen(3000);

const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
// require("dotenv").config();

//middleware
app.use(cors());
app.use(express.json());

//Routes

//CREATE A TODO

app.post("/todos", async (req, res) => {
  try {
    const { id, user_id, description, date, time, category } = req.body;
    const newTodo = await pool.query(
      `INSERT INTO todo(todo_id,user_id,description,date,time,category) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
      [id, user_id, description, date, time, category]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//GET ALL TODOS

app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo");
    console.log('all todos are" ', allTodos.rows);
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//GET A TODO

app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query(`SELECT * FROM todo WHERE todo_id = $1`, [
      id,
    ]);
    res.json(todo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//UPDATE  A TODO

app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateTodo = await pool.query(
      `UPDATE todo SET description = $1 WHERE todo_id = $2`,
      [description, id]
    );

    res.json(updateTodo);
  } catch (err) {
    console.error(err.message);
  }
});

//DELETE A TODO

app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
      id,
    ]);
    res.json("TODO WAS DELETED!");
  } catch (err) {
    console.log(err.message);
  }
});

//Auth - login

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("email is: ", email);
    const user = await pool.query(`SELECT * FROM users WHERE user_email = $1`, [
      email,
    ]);
    if (user.rowCount == 1) {
      const userData = user.rows[0];
      console.log(userData.user_password, " - ", password);
      if (String(userData.user_password) === String(password)) {
        console.log("Login Successful");
        res.json({ status: "success", data: userData });
      } else {
        console.log("Invalid Credentials");
        res.json({
          status: "failed",
          message: "Invalid LogIn credentials!",
        });
      }
    } else {
      console.log("User does not exists");
      res.json({
        status: "faield",
        message: "User does not exists!",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

// Auth - register

app.post("/auth/register", async (req, res) => {
  console.log("data is: ", req.body);
  const { userName, email, password } = req.body;

  try {
    const user_name = userName;
    const user_email = email;
    const user_password = password;
    const userExists = await pool.query(
      `SELECT * FROM users WHERE user_email = $1`,
      [user_email]
    );
    if (userExists.rowCount != 0) {
      console.log("user already exists!");
      res.json({
        status: "failed",
        message: "This email is already registered!",
        data: { user: user_name, email: user_email, password: user_password },
      });
    } else {
      const registerUser = await pool.query(
        `INSERT INTO users(user_name,user_email,user_password) VALUES($1,$2,$3) RETURNING *`,
        [user_name, user_email, user_password]
      );
      const data = registerUser.rows[0];
      res.json({
        status: "success",
        message: "Account Succesfully Created",
        data,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

// 1. Aggregrate Function - COUNT ALL TODOS
// get and count all entries

app.get("/countUsers", async (req, res) => {
  try {
    const countTodo = await pool.query(`SELECT COUNT(user_id) FROM users`);
    console.log("Total Users: ", countTodo.rows);
    res.json(countTodo.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//2. View - get all Registered Users

// View - CREATE VIEW all_user AS SELECT user,id,user_name,user_email FROM users;
//SELECT * FROM all_user

app.get("/viewAllUsers", async (req, res) => {
  try {
    const viewDesc = await pool.query(`SELECT * FROM all_user`);
    console.log("Successful!", viewDesc.rows);
    res.json(viewDesc.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// 3. Function or Stored Procedure

//Function  --
// CREATE OR REPLACE PROCEDURE delete_all(d_user_id int)
// LANGUAGE plpgsql as
// $$
// BEGIN
// delete from todo where user_id = d_user_id;
// END;
// $$

//DELETE ALL TODOS

app.delete("/storedFunctionTodo/:id", async (req, res) => {
  const { id } = req.params;
  console.log("id is: ", req.params);
  try {
    const joinTodo = await pool.query(`CALL delete_all($1)`, [id]);
    res.json("Success!");
  } catch (err) {
    console.log(err.message);
  }
});

// app.delete("/todos/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
//       id,
//     ]);
//     res.json("TODO WAS DELETED!");
//   } catch (err) {
//     console.log(err.message);
//   }
// });

// 4.  Join operator -- with or without username

app.get("/joinTodo", async (req, res) => {
  try {
    const joinTodo = await pool.query(`SELECT *
    FROM users INNER JOIN todo ON users.user_id = todo.user_id`);
    console.log("Successful!", joinTodo.rows);
    res.json(joinTodo.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// const PORT = process.env.PORT || 5000;

// app.listen(PORT);

app.listen(5000, () => {
  console.log(`Connected to the Server`);
});

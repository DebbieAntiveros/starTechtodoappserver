const router = require("express").Router();
const authorize = require("../middleware/authorize");
const pool = require("../db");

//all todos and name

router.post("/register", authorize, async (req, res) => {
  try {
    const user = await pool.query(
      `SELECT * FROM users AS u LEFT JOIN todo AS t ON u.user_id = t.user_id 
    WHERE users.user_id = $2`,
      [req.user_id]
    );
    res.json(user.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//CREATE A TODO
app.post("/todos", async (req, res) => {
  try {
    const { id, description, date, time, category } = req.body;
    const newTodo = await pool.query(
      `INSERT INTO todo(todo_id,description,date,time,category) VALUES($1,$2,$3,$4,$5) RETURNING *`,
      [id, description, date, time, category]
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

    res.json("TODO WAS UPDATED!");
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

module.exports = router;

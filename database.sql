CREATE DATABASE pern-todo;

CREATE TABLE users(
    user_id SERIAL,
	user_name VARCHAR(255) NOT NULL,
	user_email VARCHAR(255) NOT NULL UNIQUE,
	user_password VARCHAR(255) NOT NULL,
	PRIMARY KEY (user_id)

);

CREATE TABLE todo(
    todo_id SERIAL,
	user_id SERIAL,
	description VARCHAR(255) NOT NULL,
	date DATE,
	time TIME,
    category VARCHAR(255),
	PRIMARY KEY (todo_id),
	FOREIGN KEY (user_id) REFERENCES users(user_id)
);



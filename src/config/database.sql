CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    login VARCHAR(50) NOT NULL,
    password VARCHAR(500) NOT NULL,
    name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role_id INTEGER REFERENCES role(id)
);

CREATE TABLE recipe (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    path_photo VARCHAR(200) NOT NULL,
    creater_id INTEGER REFERENCES "user"(id)
);

CREATE TABLE favorite (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user"(id),
    recipe_id INTEGER REFERENCES recipe(id)
);

CREATE TABLE ingredient (
    id SERIAL PRIMARY KEY,
    info TEXT NOT NULL,
    recipe_id INTEGER REFERENCES recipe(id)
);

CREATE TABLE step (
    id SERIAL PRIMARY KEY,
    info TEXT NOT NULL,
    recipe_id INTEGER REFERENCES recipe(id)
);

INSERT INTO role (name) VALUES ('Пользователь');
INSERT INTO role (name) VALUES ('Администратор');

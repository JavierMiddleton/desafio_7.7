const request = require('supertest');
const server = require('../index');

// Importamos JSON WEB TOKEN para tener un token que nos sirva en la operación DELETE

const jwt = require('jsonwebtoken');

// Importamos DOTENV para el SECRET en una variable de entorno
const dotenv = require('dotenv');

dotenv.config();
const { SECRET } = process.env;

//Testeos de operaciones CRUD

describe("Operaciones CRUD de cafes", () => {

  //Operación GET
  it("GET /cafes - CODE 200, devolvemos un arreglo con por lo menos un objeto", async () => {
    const response = await request(server).get('/cafes').send();

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);
    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBeGreaterThan(0);
  });

  //Operación DELETE
  it("DELETE /cafes/:id - CODE 404, al intentar eliminar un ID que no existe", async () => {
    const token = jwt.sign({ email: "admin@correo.cl" }, SECRET);
    const response = await request(server)
      .delete('/cafes/21')
      .set('Authorization', `Bearer ${token}`)
      .send();

    const { statusCode } = response;

    expect(statusCode).toBe(404);
  });

  //Operación POST
  it("POST /cafes - CODE 201, al agregar un nuevo café correctamente", async () => {
    const cafe = {
      id: 13,
      nombre: "Irlandés"
    };

    const response = await request(server).post('/cafes').send(cafe);

    const { statusCode, body } = response;

    expect(statusCode).toBe(201);
    expect(body).toContainEqual(cafe);
  });

  //Operación PUT
  it("PUT /cafes/:id - CODE 400, al intentar actualizar un café enviando un café en ID distinto al ID del payload", async () => {
    const cafe = {
      id: 28,
      nombre: "Nescafé re fome"
    };

    const response = await request(server).put('/cafes/2').send(cafe);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);
    expect(body).not.toContainEqual(cafe);
  });
});

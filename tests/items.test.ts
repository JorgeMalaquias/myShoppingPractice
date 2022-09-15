import {prisma} from "../src/database";
import app from '../src/app';
import supertest from 'supertest';
import { faker } from '@faker-js/faker';


beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE items;`;
});
 function createbody () {
  return {
    title: faker.lorem.word(),
    url: faker.internet.url(),
    description: faker.lorem.paragraph(),
    amount: Number(faker.random.numeric(7))
  }
}

const body = createbody();

describe('Testa POST /items ', () => {

  it('Deve retornar 201, se cadastrado um item no formato correto',async ()=>{
    const result = await supertest(app).post("/items").send(body);
    expect(result.status).toBe(201);

  });

  it('Deve retornar 409, ao tentar cadastrar um item que exista',async()=>{
    
    await supertest(app).post("/items").send(body);
    const result = await supertest(app).post("/items").send(body);
    expect(result.status).toBe(409);

  });
});

describe('Testa GET /items ', () => {
  it('Deve retornar status 200 e o body no formato de Array',async()=>{

    
    const result = await supertest(app).get("/items").send();
    expect(result.body).toBeInstanceOf(Array);
    expect(result.status).toBe(200);
  });
});

describe('Testa GET /items/:id ', () => {
  it('Deve retornar status 200 e um objeto igual a o item cadastrado',async()=>{
    
    const resultOne = await supertest(app).post("/items").send(body);
    
    const result = await supertest(app).get(`/items/${resultOne.body.id}`).send();
    expect(result.body).toEqual({...body,id:resultOne.body.id});
    expect(result.status).toBe(200);
  });
  it('Deve retornar status 404 caso não exista um item com esse id',async()=>{
    
    const result = await supertest(app).get(`/items/2`).send();
    expect(result.status).toBe(404);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
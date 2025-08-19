import request from "supertest";
import app from "../src/app.js";

describe("E2E - Rotas de Pães", () => {
  it("deve listar pães", async () => {
    const res = await request(app).get("/paes");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("deve criar um novo pão", async () => {
    const res = await request(app)
      .post("/paes")
      .send({ name: "Pão de Queijo", preco: 5.5, textura: "macio", padariaId: 1 });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Pão de Queijo");
  });
});
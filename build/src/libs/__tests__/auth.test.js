"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../../../index");
const faker_1 = require("@faker-js/faker");
const full_name = faker_1.faker.person.fullName(); // Rowan Nikolaus
const email = faker_1.faker.internet.email(); // Kassandra.Haley@erich.biz
const username = faker_1.faker.internet.userName();
it("new user created", async () => {
    const res = await (0, supertest_1.default)(index_1.app).post("/api/v1/register").send({
        full_name,
        email,
        password: "12345678",
    });
    // console.log("RES",res);
    expect(res.statusCode).toEqual(201);
});
it("login success", async () => {
    const res = await (0, supertest_1.default)(index_1.app).post("/api/v1/login").send({
        email,
        password: "1234678",
    });
    expect(res.statusCode).toEqual(400);
});
//# sourceMappingURL=auth.test.js.map
const request = require("supertest");
const app = require("./app"); // Assuming your Express app is exported from app.js

describe("Todo List API", () => {
  let taskId;

  afterAll(() => {
    // Clean up the database or perform any necessary teardown after all tests
    // For example, you can delete the test data created during the tests
  });

  describe("POST /task", () => {
    it("should create a new task", async () => {
      const response = await request(app)
        .post("/task")
        .send({
          title: "Task 1",
          description: "Task description",
          status: "pending",
          date: "2023-06-07",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("insertedId");
      taskId = response.body.insertedId;
    });

    it("should return an error if required fields are missing", async () => {
      const response = await request(app)
        .post("/task")
        .send({
          description: "Task description",
          status: "pending",
          date: "2023-06-07",
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /task", () => {
    it("should get a list of tasks", async () => {
      const response = await request(app).get("/task");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("GET /task/:id", () => {
    it("should get a specific task by ID", async () => {
      const response = await request(app).get(`/task/${taskId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("_id", taskId);
    });

    it("should return an error if task ID is not found", async () => {
      const nonExistingId = "non-existing-id";
      const response = await request(app).get(`/task/${nonExistingId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("PATCH /task/:id", () => {
    it("should update a task's status", async () => {
      const response = await request(app)
        .patch(`/task/${taskId}`)
        .send({ status: "completed" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("modifiedCount", 1);
    });

    it("should return an error if task ID is not found", async () => {
      const nonExistingId = "non-existing-id";
      const response = await request(app)
        .patch(`/task/${nonExistingId}`)
        .send({ status: "completed" });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("DELETE /task/:id", () => {
    it("should delete a task", async () => {
      const response = await request(app).delete(`/task/${taskId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("deletedCount", 1);
    });

    it("should return an error if task ID is not found", async () => {
      const nonExistingId = "non-existing-id";
      const response = await request(app).delete(`/task/${nonExistingId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
    });
  });
});

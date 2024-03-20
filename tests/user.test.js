const request = require("supertest");
const sequelize = require("../db/connection");
const { app, startServer } = require("../app");
const logger = require("../logger.js");

//let server;

beforeAll(() => {
  try {
    // Start the server after syncing the database
    server = app.listen();
  } catch (error) {
    logger.error("Error connecting to the database:", error);
    process.exit(1);
  }
});

describe("User Integration Tests", () => {
  let userId;

  it("should create a user and validate its existence", async () => {
    // Send a POST request to create a user
    const createResponse = await request(app).post("/v1/user").send({
      first_name: "John",
      last_name: "Doe",
      password: "password123",
      username: "john.doe@example.com",
    });

    // Ensure the user is created successfully
    expect(createResponse.statusCode).toEqual(201);
    userId = createResponse.body.id;

    // Send a GET request to retrieve the created user
    const getUserResponse = await request(app)
      .get(`/v1/user/self`)
      .set(
        "Authorization",
        "Basic " +
          Buffer.from("john.doe@example.com" + ":" + "password123").toString(
            "base64"
          )
      );

    // Ensure the user exists and has the correct username
    expect(getUserResponse.statusCode).toEqual(200);
    expect(getUserResponse.body.username).toBe("john.doe@example.com");
  });

  it("should update a user and validate the update", async () => {
    // Ensure a user ID is available from the previous test
    expect(userId).toBeDefined();

    // Send a PUT request to update the user
    const updateResponse = await request(app)
      .put(`/v1/user/self`)
      .set(
        "Authorization",
        "Basic " +
          Buffer.from("john.doe@example.com" + ":" + "password123").toString(
            "base64"
          )
      )
      .send({
        first_name: "UpdatedJohn",
        last_name: "UpdatedDoe",
      });

    // Ensure the user is updated successfully
    expect(updateResponse.status).toBe(204);

    // Send a GET request to retrieve the updated user
    const getUpdatedUserResponse = await request(app)
      .get(`/v1/user/self`)
      .set(
        "Authorization",
        "Basic " +
          Buffer.from("john.doe@example.com" + ":" + "password123").toString(
            "base64"
          )
      );

    // Ensure the updated user exists and has the correct information
    expect(getUpdatedUserResponse.status).toBe(200);
    expect(getUpdatedUserResponse.body.username).toBe("john.doe@example.com");
    expect(getUpdatedUserResponse.body.first_name).toBe("UpdatedJohn");
    expect(getUpdatedUserResponse.body.last_name).toBe("UpdatedDoe");
  });
});

afterAll(() => {
  server.close();
});

import axios from "axios";

describe("User testing", () => {
  it("should create a user", async () => {
    const userToCreate = {
      usuNom: "UserTest",
      usuCor: "test13@fortest.com", // increase number to create a user
      usuCon: "123",
      disCod: 1,
      usuFotURL: "https://google.com",
      usuFecNacAno: 2002,
      usuFecNacMes: 10,
      usuFecNacDia: 12,
    };
    const url = "http://localhost:5000/api/users/create";
    const result = await axios.post(url, userToCreate);
    expect(result.status).toBe(200);
  });
  it("should get all users", async () => {
    const userToLogin = {
      usuCor: "test@fortest.com",
      usuCon: "123",
    };
    const url = "http://localhost:5000/api/users/login";
    const result = await axios.post(url, userToLogin);
    expect(result.data.length).toBe(1); // returns 1 user
  });
  it("should return a error message when it creates a repeated user", async () => {
    const userToCreate = {
      usuNom: "UserTest",
      usuCor: "test@fortest.com", // email already exists
      usuCon: "123",
      disCod: 1,
      usuFotURL: "https://google.com",
      usuFecNacAno: 2002,
      usuFecNacMes: 10,
      usuFecNacDia: 12,
    };
    const url = "http://localhost:5000/api/users/create";
    try {
      await axios.post(url, userToCreate);
    } catch (error) {
      expect(error.response.data.error).toBe("El correo ya existe");
    }
  });
});

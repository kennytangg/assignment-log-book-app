import { GET as GETAll, POST } from "@/app/api/assignments/route";
import { GET, PUT, DELETE } from "@/app/api/assignments/[id]/route";
import { createRequest } from "node-mocks-http";

// ---- GET ALL ----
describe("GET /api/assignments", () => {
  it("should return all assignments with status 200", async () => {
    const req = new Request("http://localhost:3000/api/assignments");
    const res = await GETAll(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });
});

// ---- POST ----
describe("POST /api/assignments", () => {
  it("should create a new assignment with status 201", async () => {
    const req = new Request("http://localhost:3000/api/assignments", {
      method: "POST",
      body: JSON.stringify({
        title: "Test Assignment",
        subject: "Testing",
        description: "Test description",
        dueDate: "2026-03-20",
        status: "pending",
      }),
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.data.title).toBe("Test Assignment");
  });

  it("should return 400 if required fields are missing", async () => {
    const req = new Request("http://localhost:3000/api/assignments", {
      method: "POST",
      body: JSON.stringify({}), // empty body
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
  });
});

// ---- GET BY ID ----
describe("GET /api/assignments/:id", () => {
  it("should return assignment with status 200", async () => {
    const req = new Request("http://localhost:3000/api/assignments/1");
    const res = await GET(req, { params: Promise.resolve({ id: "1" }) });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.id).toBe("1");
  });

  it("should return 404 if assignment not found", async () => {
    const req = new Request("http://localhost:3000/api/assignments/999");
    const res = await GET(req, { params: Promise.resolve({ id: "999" }) });
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.message).toBe("Assignment not found");
  });
});

// ---- PUT ----
describe("PUT /api/assignments/:id", () => {
  it("should update assignment with status 200", async () => {
    const req = new Request("http://localhost:3000/api/assignments/1", {
      method: "PUT",
      body: JSON.stringify({ status: "completed" }),
    });
    const res = await PUT(req, { params: Promise.resolve({ id: "1" }) });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.status).toBe("completed");
  });

  it("should return 404 if assignment not found", async () => {
    const req = new Request("http://localhost:3000/api/assignments/999", {
      method: "PUT",
      body: JSON.stringify({ status: "completed" }),
    });
    const res = await PUT(req, { params: Promise.resolve({ id: "999" }) });
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.success).toBe(false);
  });
});

// ---- DELETE ----
describe("DELETE /api/assignments/:id", () => {
  it("should delete assignment with status 200", async () => {
    const req = new Request("http://localhost:3000/api/assignments/2");
    const res = await DELETE(req, { params: Promise.resolve({ id: "2" }) });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe("Assignment deleted");
  });

  it("should return 404 if assignment not found", async () => {
    const req = new Request("http://localhost:3000/api/assignments/999");
    const res = await DELETE(req, { params: Promise.resolve({ id: "999" }) });
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.success).toBe(false);
  });
});
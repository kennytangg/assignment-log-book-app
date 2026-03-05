import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = () => {
    return createSwaggerSpec({
        apiFolder: "app/api",
        definition: {
            openapi: "3.0.3",
            info: {
                title: "Assignment Log API",
                version: "1.0.0",
                description: "REST API for managing assignments",
            },
            tags: [{ name: "Assignments", description: "Assignment endpoints" }],
            components: {
                schemas: {
                    Assignment: {
                        type: "object",
                        properties: {
                            id: { type: "string", example: "abc-123" },
                            title: { type: "string", example: "Math Homework" },
                            subject: { type: "string", example: "Mathematics" },
                            description: { type: "string", example: "Complete chapter 5" },
                            dueDate: { type: "string", example: "2026-03-10" },
                            status: {
                                type: "string",
                                enum: ["pending", "completed", "overdue"],
                                example: "pending",
                            },
                            createdAt: { type: "string", example: "2026-03-01T00:00:00.000Z" },
                        },
                    },
                    AssignmentInput: {
                        type: "object",
                        required: ["title", "subject", "description", "dueDate"],
                        properties: {
                            title: { type: "string", example: "Math Homework" },
                            subject: { type: "string", example: "Mathematics" },
                            description: { type: "string", example: "Complete chapter 5" },
                            dueDate: { type: "string", example: "2026-03-10" },
                            status: {
                                type: "string",
                                enum: ["pending", "completed", "overdue"],
                                example: "pending",
                            },
                        },
                    },
                },
            },
        },
    });
};
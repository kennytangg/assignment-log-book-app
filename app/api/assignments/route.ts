/**
 * @swagger
 * /api/assignments:
 *   get:
 *     tags: [Assignments]
 *     summary: Get all assignments
 *     responses:
 *       200:
 *         description: List of all assignments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Assignment'
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     tags: [Assignments]
 *     summary: Create a new assignment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignmentInput'
 *     responses:
 *       201:
 *         description: Assignment created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */

import { NextResponse } from "next/server";
import { assignments } from "@/lib/data";

// GET /api/assignments — get all assignments
export async function GET() {
  try {
    return NextResponse.json(
      { success: true, data: assignments },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch assignments" },
      { status: 500 }
    );
  }
}

// POST /api/assignments — create new assignment
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, subject, description, dueDate, status } = body;

    // basic validation
    if (!title || !subject || !description || !dueDate) {
      return NextResponse.json(
        { success: false, message: "title, subject, description, and dueDate are required" },
        { status: 400 }
      );
    }

    const newAssignment = {
      id: crypto.randomUUID(),
      title,
      subject,
      description,
      dueDate,
      status: status ?? "pending",
      createdAt: new Date().toISOString(),
    };

    assignments.push(newAssignment);

    return NextResponse.json(
      { success: true, data: newAssignment },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to create assignment" },
      { status: 500 }
    );
  }
}
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
import { prisma } from "@/lib/prisma";

// GET /api/assignments — get all assignments
export async function GET() {
  try {
    const assignments = await prisma.assignment.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: assignments }, { status: 200 });
  } catch {
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
    const { title, description, dueDate, status } = body;

    if (!title || !description || !dueDate) {
      return NextResponse.json(
        { success: false, message: "title, description, and dueDate are required" },
        { status: 400 }
      );
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        dueDate,
        status: status ?? "Create",
      },
    });

    return NextResponse.json({ success: true, data: assignment }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to create assignment" },
      { status: 500 }
    );
  }
}
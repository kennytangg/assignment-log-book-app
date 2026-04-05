/**
 * @swagger
 * /api/assignments/{id}:
 *   get:
 *     tags: [Assignments]
 *     summary: Get assignment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Assignment found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
 *       404:
 *         description: Assignment not found
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     tags: [Assignments]
 *     summary: Update assignment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignmentInput'
 *     responses:
 *       200:
 *         description: Assignment updated successfully
 *       404:
 *         description: Assignment not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     tags: [Assignments]
 *     summary: Delete assignment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Assignment deleted successfully
 *       404:
 *         description: Assignment not found
 *       500:
 *         description: Internal server error
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";

type Params = { params: Promise<{ id: string }> };

// GET /api/assignments/:id — get single assignment
export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const assignment = await prisma.assignment.findUnique({ where: { id } });

    if (!assignment) {
      return NextResponse.json(
        { success: false, message: "Assignment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: assignment }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch assignment" },
      { status: 500 }
    );
  }
}

// PUT /api/assignments/:id — update assignment
export async function PUT(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, description, dueDate, status } = body;

    const assignment = await prisma.assignment.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(dueDate && { dueDate }),
        ...(status && { status }),
      },
    });

    return NextResponse.json({ success: true, data: assignment }, { status: 200 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, message: "Assignment not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Failed to update assignment" },
      { status: 500 }
    );
  }
}

// DELETE /api/assignments/:id — delete assignment
export async function DELETE(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const assignment = await prisma.assignment.delete({ where: { id } });

    return NextResponse.json(
      { success: true, message: "Assignment deleted", data: assignment },
      { status: 200 }
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, message: "Assignment not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Failed to delete assignment" },
      { status: 500 }
    );
  }
}
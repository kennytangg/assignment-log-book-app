import { NextResponse } from "next/server";
import { assignments } from "@/lib/data";

// GET /api/assignments/:id — get single assignment
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const assignment = assignments.find((assignment) => assignment.id === params.id);

        if (!assignment) {
            return NextResponse.json(
                { success: false, message: "Assignment not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, data: assignment },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to fetch assignment" },
            { status: 500 }
        );
    }
}

// PUT /api/assignments/:id — update assignment
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const index = assignments.findIndex((a) => a.id === params.id);

        if (index === -1) {
            return NextResponse.json(
                { success: false, message: "Assignment not found" },
                { status: 404 }
            );
        }

        const body = await req.json();
        assignments[index] = { ...assignments[index], ...body };

        return NextResponse.json(
            { success: true, data: assignments[index] },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to update assignment" },
            { status: 500 }
        );
    }
}

// DELETE /api/assignments/:id — delete assignment
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const index = assignments.findIndex((a) => a.id === params.id);

        if (index === -1) {
            return NextResponse.json(
                { success: false, message: "Assignment not found" },
                { status: 404 }
            );
        }

        const deleted = assignments.splice(index, 1)[0];

        return NextResponse.json(
            { success: true, message: "Assignment deleted", data: deleted },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to delete assignment" },
            { status: 500 }
        );
    }
}
import { NextResponse } from "next/server";
import { searchProjects } from "@/app/lib/db";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { searchTerm, language, license, weight } = body;

        const results = await searchProjects(searchTerm, language, license, weight);
        return NextResponse.json(results, { status: 200 });
    } catch (error) {
        console.error("Error searching projects:", error);
        return NextResponse.json({ message: "Error searching projects" }, { status: 500 });
    }
};

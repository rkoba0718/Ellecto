import { NextResponse } from "next/server";
import { getSimilarProjects, getProjectDetails } from "@/app/lib/db";

export async function GET(req: Request, { params }: { params: { packageName: string } }) {
    try {
        const { packageName } = params;
        const similarProjectNames = await getSimilarProjects(packageName);
        const projectDetails = await Promise.all(
            similarProjectNames.map((name) => getProjectDetails(name))
        );

        return NextResponse.json(projectDetails);
    } catch (error) {
        console.error("Error fetching similar projects:", error);
        const errorMessage = error instanceof Error ? error.message : "Error fetching similar project data";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}

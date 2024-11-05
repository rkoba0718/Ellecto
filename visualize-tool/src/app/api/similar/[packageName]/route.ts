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
        // TODO: エラー処理
        console.error("Error fetching similar projects:", error);
        return NextResponse.json({ error: "Failed to fetch similar projects" }, { status: 500 });
    }
}

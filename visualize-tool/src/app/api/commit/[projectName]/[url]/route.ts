import { NextRequest, NextResponse } from "next/server";
import { getProjectDetails, cacheCommitData } from "@/app/lib/db";
import { fetchGithubCommitData, fetchSalsaDebianCommitData } from "@/app/lib/restAPI";
import { extractCommitDate, countMonthlyCommits } from "@/app/lib/commits";

export async function GET(req: NextRequest, { params }: { params: { projectName: string, url: string } }) {
    const { projectName, url } = params;
    const project = await getProjectDetails(projectName);

    const lastFetchDate = project?.Commit?.lastFetchDate;
    const cacheData = project?.Commit?.cacheData || {};
    let allCommits: any[] = [];
    let totalCommits = 0;

    try {
        allCommits = url.includes('github.com')
            ? await fetchGithubCommitData(url, lastFetchDate)
            : url.includes('salsa.debian.org')
            ? await fetchSalsaDebianCommitData(url, lastFetchDate)
            : null;

        if (allCommits === null) return (null)

        const commitDate = extractCommitDate(allCommits, url);
        const monthlyCommits = countMonthlyCommits(commitDate);
        const newCacheData = { ...cacheData, ...monthlyCommits };
        Object.keys(newCacheData).map((key) => totalCommits += newCacheData[key]);
        await cacheCommitData(project._id, newCacheData, new Date());

        return NextResponse.json({ newCacheData, totalCommits }, { status: 200 });
    } catch (error) {
        console.error("Error fetching or caching commit data:", error);
        const errorMessage = error instanceof Error ? error.message : "Error fetching commit data";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
};

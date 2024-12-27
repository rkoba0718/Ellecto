import { NextRequest, NextResponse } from "next/server";
import { Dependency } from '@/app/types/Dependency';
import { ProjectInfo } from "@/app/types/ProjectInfo";
import { getTransitiveDependencies } from "@/app/lib/db";

export async function GET(req: NextRequest, { params }: { params: { dependencies: string} }) {
    const { dependencies } = params;
    const dependenciesArray = dependencies.split('&');
    const transitiveDependencies: ProjectInfo[] = []; // 推移的に依存するプロジェクトを保存する配列変数
    try {
        for (const dep of dependenciesArray) {
            const transDep = await getTransitiveDependencies(dep);
            if (transDep.length !== 0) {
                transitiveDependencies.push(transDep);
            }
        }
        return NextResponse.json({ transitiveDependencies }, { status: 200 });
    } catch (error) {
        console.error("Error get transitive dependencies:", error);
        const errorMessage = error instanceof Error ? error.message : "Error get transitive dependencies";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
};

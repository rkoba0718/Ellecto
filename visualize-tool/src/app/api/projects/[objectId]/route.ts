import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/app/lib/db';

export async function GET(req: Request, { params }: { params: { objectId: string } }) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection(process.env.UBUNTU_COLLECTION_NAME as string);

        const { objectId } = params;

        // `objectId` に該当するデータをMongoDBから取得
        const project = await collection.findOne({ _id: new ObjectId(objectId) });

        if (!project) {
            return NextResponse.json({ message: 'Project not found' }, { status: 404 });
        }

        const dependencies = project['Build-Depends'] ? project['Build-Depends'] : undefined;
        const transitiveDependencyProjects = []; // 推移的に依存するプロジェクトを保存するオブジェクト
        if (dependencies !== undefined) {
            for (const dep of dependencies) {
                const transDep = await collection.findOne({ Name: dep.Name });
                if (transDep) {
                    transitiveDependencyProjects.push(transDep);
                }
            }
        }

        return NextResponse.json({ project, transitiveDependencyProjects }, { status: 200 });
    } catch (error) {
        // TODO: エラー処理
        console.error('Error fetching project:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};

"use client";

import React from "react";
import { ForceGraph2D } from "react-force-graph";

import { Graph } from "@/app/types/Graph";

type DependencyGraphProps = {
    graphData: Graph;
};

const DependencyGraph: React.FC<DependencyGraphProps> = ({
    graphData
}) => {
    return (
        <ForceGraph2D
            graphData={graphData}
            width={600}
            height={280}
            nodeLabel="id"
            nodeAutoColorBy="color"
            linkDirectionalArrowLength={4} // エッジの長さ
            linkDirectionalArrowRelPos={1} // エッジの位置（1でリンクの端に表示）
            linkColor={() => "#808080"} // エッジの色
            backgroundColor="#FFFFFF"
            nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.id;
                const fontSize = 8 / globalScale;
                ctx.font = `${fontSize}px Sans-Serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = node.color;
                if (node.x !== undefined && node.y !== undefined) {
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, 4, 0, 2 * Math.PI, false);
                    ctx.fill();
                    ctx.fillStyle = "#000";
                    ctx.fillText(label, node.x, node.y - 6);
                }
            }}
            enableZoomInteraction={true} // ズーム操作を有効化
            enablePanInteraction={true} // パン操作（＝ノードやグラフを掴んで動かす操作）を有効化
        />
    );
};

export default DependencyGraph;
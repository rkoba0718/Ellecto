type graphNode = {
    id: string;
    color: string;
};

type graphLink = {
    source: any;
    target: string;
};

export type Graph = {
    nodes: graphNode[],
    links: graphLink[],
};
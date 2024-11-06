import { format } from "date-fns";

// REST APIによって取得したコミットデータからコミット日のみを抽出する関数
export const extractCommitDate = (commits: any[], url: string) => {
    let commitDate: string[] = [];

    // urlによって，dateの格納位置が違うので，それに対応
    if (url.includes('github.com')) {
        commitDate = commits.map((commit: any) => commit.commit.author.date);
    } else if (url.includes('salsa.debian.org')) {
        commitDate = commits.map((commit: any) => commit.committed_date);
    }

    return commitDate;
};

// 各月ごとのコミット数を集計する関数
export const countMonthlyCommits = (commitDate: string[]): { [month: string]: number } => {
    const monthlyCommits: { [month: string]: number } = {};
    commitDate.forEach((c) => {
        const date = new Date(c);
        const month = format(date, "yyyy-MM");
        monthlyCommits[month] = (monthlyCommits[month] || 0) + 1;
    });
    return monthlyCommits;
};

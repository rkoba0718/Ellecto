import { Octokit } from "octokit";
import axios from "axios";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // GitHub REST APIを使用するためのトークン

export async function fetchGithubCommitData(repoUrl: string, lastFetchDate?: Date) {
    const repoName = repoUrl.split("github.com/")[1];
    const octokit = new Octokit({ auth: GITHUB_TOKEN });

    let allCommits: any = [];
    let page = 1;
    let hasMoreCommits = true;

    while (hasMoreCommits) {
        try {
            // ページネーションでコミットデータを取得
            const commitData = await octokit.request(`GET /repos/${repoName}/commits`, {
                per_page: 100,
                page,
                since: lastFetchDate?.toISOString(), // 差分取得用に最終データ取得日以降のデータのみ取得
            });

            allCommits = allCommits.concat(commitData.data);

            // 取得したデータが100件未満であれば、次のページはないと判断
            if (commitData.data.length < 100) {
                hasMoreCommits = false;
            } else {
                page++;
            }
        } catch (error) {
            console.error('Error fetching commits:', error);
            throw new Error('Error fetching github commit data');
        }
    }

    return allCommits;
};

export async function fetchGithubContributorData(repoUrl: string) {
    const repoName = repoUrl.split("github.com/")[1];
    const octokit = new Octokit({ auth: GITHUB_TOKEN });

    try {
        const contributorData = await octokit.request(`GET /repos/${repoName}/contributors`, {
            per_page: 5,
        });
        const detailData = contributorData.data.map((contributor: any) => ({
            name: contributor.login,
            email: null,
            contributions: contributor.contributions,
            html_url: contributor.html_url,
            avatar_url: contributor.avatar_url
        }));
        return detailData;
    } catch (error) {
        console.error('Error fetching contributors:', error);
        throw new Error('Error fetching github contributor data');
    }

};

export async function fetchGithubRepoData(repoUrl: string) {
    const repoName = repoUrl.split("github.com/")[1];
    const octokit = new Octokit({ auth: GITHUB_TOKEN });

    try {
        const repoData = await octokit.request(`GET /repos/${repoName}`);
        const { stargazers_count, forks_count } = repoData.data;
        return {
            stars: stargazers_count,
            forks: forks_count
        };
    } catch (error) {
        console.error('Error fetching repository data:', error);
        throw new Error('Error fetching github repository data');
    }
};

export async function fetchSalsaDebianCommitData(repoUrl: string, lastFetchDate?: Date) {
    const repoName = repoUrl.split("salsa.debian.org/")[1];
    const perPage = 100;
    let page = 1;
    let allCommits: any = [];
    let hasMore = true;

    while (hasMore) {
        try {
            const response = await axios.get(
                `https://salsa.debian.org/api/v4/projects/${encodeURIComponent(repoName)}/repository/commits`,
                {
                    params: {
                        per_page: perPage,
                        page: page,
                        since: lastFetchDate?.toISOString(), // 差分取得用に最終データ取得日以降のデータのみ取得
                    },
                }
            );
            const commits = response.data;

            allCommits = allCommits.concat(commits);

            // 次のページがあるかを判定
            hasMore = commits.length === perPage;
            page++;
        } catch (error) {
            console.error('Error fetching commits:', error);
            throw new Error('Error fetching salsa debian commit data');
        }
    }

    return allCommits;
};

export async function fetchSalsaDebianContributorData(repoUrl: string) {
    const repoName = repoUrl.split("salsa.debian.org/")[1];

    try {
        const contributorData = await axios.get(
            `https://salsa.debian.org/api/v4/projects/${encodeURIComponent(repoName)}/repository/contributors?per_page=100`
        );

        const sortedData = contributorData.data.sort((a: any, b: any) => b.commits - a.commits).slice(0, 5);

        const contributorDetails = await Promise.all(
            sortedData.map(async (contributor: any) => {
                try {
                    const avatar_url = await axios.get(
                        `https://salsa.debian.org/api/v4/avatar?email=${encodeURIComponent(contributor.email)}`
                    );
                    return {
                        name: contributor.name,
                        email: contributor.email,
                        contributions: contributor.commits,
                        html_url: null,
                        avatar_url: avatar_url.data['avatar_url']
                    };
                } catch (error) {
                    console.error(`Error fetching user data for ${contributor.name}:`, error);
                    throw new Error('Error fetching salsa debian contributor data');
                }
            })
        )

        return contributorDetails;
    } catch (error) {
        console.error(`Error fetching user data:`, error);
        throw new Error('Error fetching salsa debian contributor data');
    }
};

export async function fetchSalsaDebianRepoData(repoUrl: string) {
    const repoName = repoUrl.split("salsa.debian.org/")[1];

    try {
        const repoData = await axios.get(
            `https://salsa.debian.org/api/v4/projects/${encodeURIComponent(repoName)}`
        );

        const { star_count, forks_count } = repoData.data;

        return {
            stars: star_count,
            forks: forks_count
        };
    } catch (error) {
        console.error(`Error fetching repository data:`, error);
        throw new Error('Error fetching salsa debian repository data');
    }
};

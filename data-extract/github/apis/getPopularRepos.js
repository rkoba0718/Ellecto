export async function getPopularRepos(octokit) {
	try {
	  // GitHub APIのsearch/repositoriesエンドポイントを使用して条件に合致するリポジトリを取得
	  const reposData = await octokit.request("GET /search/repositories", {
		q: `created:2022 stars:>=40000`,
	  });

	  const result = reposData.data.items;
	  const trimmedRepos = reposData.data.items.map(repo => ({
		name: repo.name,
		html_url: repo.html_url,
		clone_url: repo.clone_url
	  }));

	  return [result, trimmedRepos];
	} catch (error) {
	  if (error.response) {
		console.error(`Error! Status: ${error.response.status}. Message: ${error.response.data.message}`)
	  }
	  console.error(error)
	  return null; // エラー時にnullを返す
	}
}
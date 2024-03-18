async function getUserRepos({ octokit, username }) {
	try {
	  const reposData = await octokit.request("GET /users/{username}/repos", {
		username: username
	  });

	  // 必要なプロパティ(html_urlとclone_url)のみを抽出して新しいオブジェクトを作成
	  const trimmedOut = reposData.data.map(repo => ({
		html_url: repo.html_url,
		clone_url: repo.clone_url
	  }));

	  return [reposData.data, trimmedOut];
	} catch (error) {
	  if (error.response) {
		console.error(`Error! Status: ${error.response.status}. Message: ${error.response.data.message}`)
	  }
	  console.error(error)
	  return null; // エラー時にnullを返す
	}
}

export async function callGetUserRepos(octokit, input) {
	const result = [];
	const trimmedResult = [];

	for (let i = 0; i < input.length; i += 1) {
		const [repos, trimmedOut] = await getUserRepos({ octokit: octokit, username: input[i] });
		if (repos) {
			result.push({ username: input[i], repos });
		}
		if (trimmedOut) {
			trimmedResult.push({username: input[i], trimmedOut});
		}
	}

	return [result, trimmedResult];
}
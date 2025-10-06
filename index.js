async function loadProfile(username) {
    let reposResponse = await fetch("https://api.github.com/users/" + username + "/repos");
    if(!reposResponse.ok){
        alert('Failed to load repos');
        return;
    }
    let repos = await reposResponse.json();
    let repoContainerElement = document.getElementById('repo-container');
    repoContainerElement.replaceChildren(); //Clears children
    for(let repo of repos){
        let repoElement = document.createElement("div");
        repoElement.classList.add("repo");
        let repoTitleElement = document.createElement("a");
        repoTitleElement.href = repo.html_url;
        repoTitleElement.classList.add("repo-title");
        repoTitleElement.textContent = repo.name;

        repoElement.append(repoTitleElement);
        repoContainerElement.append(repoElement);

    }
}
loadProfile("cmsteffey");
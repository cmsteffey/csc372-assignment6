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
        let repoDescriptionElement = document.createElement("p");
        repoDescriptionElement.classList.add("repo-description");
        if(repo.description == null){
            repoDescriptionElement.classList.add("null");
        }
        repoDescriptionElement.textContent = repo.description.length > 200 ?
            repo.description.substring(0, 197) + "..." : repo.description;

        let repoCreationDateElement = document.createElement("p");
        repoCreationDateElement.classList.add("repo-text-item");
        repoCreationDateElement.innerText = "Created at: " + new Date(repo.created_at).toLocaleDateString("en-US",
            {month: "2-digit", day: "2-digit", year: "numeric"});
        let repoModificationDateElement = document.createElement("p");
        repoModificationDateElement.classList.add("repo-text-item");
        repoModificationDateElement.innerText = "Last modified at: " + new Date(repo.pushed_at).toLocaleDateString("en-US",
            {month: "2-digit", day: "2-digit", year: "numeric"});
        repoElement.append(
            repoTitleElement,
            repoDescriptionElement,
            repoCreationDateElement,
            repoModificationDateElement
        );
        repoContainerElement.append(repoElement);

    }
}
loadProfile("cmsteffey");
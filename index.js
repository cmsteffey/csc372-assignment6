async function loadProfile(username) {
    //Fine grain PAT with only readonly access to only public spaces.
    let options = window.getPat ? {headers: {Authorization: `token ${getPat()}`}} : {};

    let reposResponse = await fetch("https://api.github.com/users/" + username + "/repos", options);
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
        repoDescriptionElement.textContent = (repo.description?.length ?? 0) > 200 ?
            repo.description.substring(0, 197) + "..." : repo.description;

        let repoCreationDateElement = document.createElement("p");
        repoCreationDateElement.classList.add("repo-text-item");
        repoCreationDateElement.innerText = "Created at: " + new Date(repo.created_at).toLocaleDateString("en-US",
            {month: "2-digit", day: "2-digit", year: "numeric"});
        let repoModificationDateElement = document.createElement("p");
        repoModificationDateElement.classList.add("repo-text-item");
        repoModificationDateElement.innerText = "Last modified at: " + new Date(repo.pushed_at).toLocaleDateString("en-US",
            {month: "2-digit", day: "2-digit", year: "numeric"});
        let repoWatchersElement = document.createElement("p");
        repoWatchersElement.classList.add("repo-text-item");
        repoWatchersElement.innerText = "Watchers: " + repo.watchers;
        let languagesElement = document.createElement("p");
        languagesElement.classList.add("repo-text-item");
        languagesElement.innerText = "Loading languages...";
        fetch(repo.languages_url, options).then(languagesResponse => languagesResponse.json()).then(languages=>{
            let total = 0;
            let languageMap = new Map();
            for(let language in languages){
                console.log(language);
                if(languages.hasOwnProperty(language)){
                    languageMap.set(language, languages[language]);
                    total += languages[language];
                }
            }
            console.log(languageMap);
            languagesElement.innerText = Array.from(languageMap.entries()).sort((a, b) => -(a[1] - b[1]))
                .map(languageEntry => languageEntry[0] + ": " + Math.round(languageEntry[1] * 1000 / total) / 10 + "%" ).join(", ");

        }).catch(_=> {languagesElement.innerText = "Language lookup error";});
        repoElement.append(
            repoTitleElement,
            repoDescriptionElement,
            repoCreationDateElement,
            repoModificationDateElement,
            repoWatchersElement,
            languagesElement,
        );
        repoContainerElement.append(repoElement);

    }
}
loadProfile("cmsteffey");
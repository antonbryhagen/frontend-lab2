function displayProfile(){

    const urlParms = new URLSearchParams(window.location.search);
    const userId = urlParms.get('userId');

    fetch(`https://dummyjson.com/users/${userId}`)
        .then(response => response.json())
        .then(data => {
            const profileContainer = document.getElementById("profile-container")
            let profileFragment = document.createDocumentFragment();
        
            let profileImg = document.createElement("img");
            profileImg.src = data.image;
            profileImg.alt = `Profile picture for user ${data.username}`;
            profileFragment.appendChild(profileImg);
        
            let profileH2 = document.createElement("h2");
            profileH2.innerText = `${data.firstName} ${data.lastName}`;
            profileFragment.appendChild(profileH2);
        
            let profileH3 = document.createElement("h3");
            profileH3.innerText = `@${data.username}`;
            profileFragment.appendChild(profileH3);
        
            profileContainer.appendChild(profileFragment);
        })
        .catch(error => console.error("Error", error));

    
}

displayProfile();
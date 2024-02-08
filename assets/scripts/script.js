function displayMenu(){
    const menuIcon = document.getElementById("menuIcon");
    const navigation = document.getElementsByTagName("nav");
    const h1 = document.getElementsByTagName("h1");
    const anchors = document.querySelectorAll("a.nav-link");

    const closeIconPath = "assets/images/closeicon.svg";
    const menuIconPath = "assets/images/menuicon.svg";

    if(menuIcon.getAttribute("src") === menuIconPath){
        menuIcon.src = closeIconPath;
    }else{
        menuIcon.src = menuIconPath;
    }
    Array.from(navigation).forEach((nav) => {
        nav.classList.toggle("open");
    });
    Array.from(h1).forEach((h1) => {
        h1.classList.toggle("hide");
    });
    anchors.forEach((anchor) => {
        anchor.classList.toggle("show");
    });
}

async function fetchPostsAndComments(){

    let postsList = [];

    try{
        const [postResponse, commentResponse, userResponse] = await Promise.all([
            fetch("https://dummyjson.com/posts?limit=150"),
            fetch("https://dummyjson.com/comments?limit=340"),
            fetch("https://dummyjson.com/users?limit=100")
        ]);

        const posts = await postResponse.json();
        const comments = await commentResponse.json();
        const users = await userResponse.json();

        // console.log(posts);

        posts.posts.forEach((post) => {
            postsList.push(createPost(post.id, post.title, post.body, post.userId, users.users.filter(id => id.id === post.userId)[0].username, post.tags, post.reactions, comments.comments.filter(id => id.postId === post.id)));
        });

    } catch(error){
        console.error("Fail to fetch data or build HTML", error);
    }
    return postsList
}

function createPost(id, title, body, userId, userName, tags, reactions, comments){
    let post = {
        "id": id,
        "title": title,
        "body": body,
        "userId": userId,
        "userName": userName,
        "tags": tags,
        "reactions": reactions,
        "comments": []
    };

    comments.forEach((comment) => { //måste man ha parantes runt parameter?
        post.comments.push({
            "id": comment.id,
            "body": comment.body,
            "postId": comment.postId,
            "user": {
                "id": comment.user.id,
                "userName": comment.user.username,
            }
        })
    });

    return post;
}

let finalPostList = fetchPostsAndComments();

let posts = "";

finalPostList.then((postList) => {
    posts = postList;
    // postList.forEach(element =>{
    //     console.log(element);
    // })
    displayPosts(currentPage);
});

let currentPage = 1;
const itemsPerPage = 5;

function displayPosts(page){
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const postsToDisplay = posts.slice(start, end);

    const container = document.getElementById("post-container");
    postsToDisplay.forEach((post) => {
        //build post
        let postFragment = document.createDocumentFragment();

        let postArticle = document.createElement("article");
        postArticle.classList.add("post");
        postFragment.appendChild(postArticle);

        let postContentSection = document.createElement("section");
        postContentSection.classList.add("post-content");
        postArticle.appendChild(postContentSection);

        let postH2 = document.createElement("h2");
        postH2.innerText = post.title;
        postContentSection.appendChild(postH2);

        let postBodyP = document.createElement("p");
        postBodyP.innerText = post.body;
        postBodyP.classList.add("post-body");
        postContentSection.appendChild(postBodyP);

        let infoDiv = document.createElement("div");
        infoDiv.classList.add("post-info");
        postContentSection.appendChild(infoDiv);

        let postAuthorP = document.createElement("p");
        postAuthorP.innerText = `Posted by ${post.userName}`;
        postAuthorP.classList.add("post-author");
        postAuthorP.addEventListener("click", function(){
            window.location.href = `profile.html?userId=${post.userId}`;
        });
        infoDiv.appendChild(postAuthorP);

        let postReactionsP = document.createElement("p");
        postReactionsP.innerText = `${post.reactions} reactions`;
        postReactionsP.classList.add("post-reactions");
        infoDiv.appendChild(postReactionsP);

        let postCommentSection = document.createElement("section");
        postCommentSection.classList.add("post-comments");
        postArticle.appendChild(postCommentSection);

        let commentH3 = document.createElement("h3");
        commentH3.innerText = "Comments";
        postCommentSection.appendChild(commentH3);

        post.comments.forEach((comment => {
            let commentAuthorP = document.createElement("p");
            commentAuthorP.innerText = comment.user.userName;
            commentAuthorP.classList.add("comment-author");
            postCommentSection.appendChild(commentAuthorP);

            let commentBodyP = document.createElement("p");
            commentBodyP.innerText = comment.body;
            commentBodyP.classList.add("comment-body");
            postCommentSection.appendChild(commentBodyP);
        }));

        container.appendChild(postFragment);
    });
}

function setUpInfiniteScroll(){
    let timeout;
    let buffer = 200;

    window.onscroll = () => {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            let scrollPosition = window.innerHeight + window.scrollY;
            let adjustedOffsetHeight = Math.max(document.body.offsetHeight, buffer);

            if(scrollPosition >= adjustedOffsetHeight - buffer){
                currentPage++;

                if((currentPage - 1) * itemsPerPage < posts.length){
                    displayPosts(currentPage);
                }
            }
        }, 300);
    };
}

setUpInfiniteScroll();


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
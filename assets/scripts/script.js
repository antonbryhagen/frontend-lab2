function displayMenu(){
    const menuIcon = document.getElementById("menuIcon");
    const navigation = document.getElementsByTagName("nav");
    const h1 = document.getElementsByTagName("h1");
    // const header = document.getElementsByTagName("header");
    const anchors = document.querySelectorAll("a.nav-link");

    const closeIconPath = "assets/images/closeicon.svg";
    const menuIconPath = "assets/images/menuicon.svg";

    

    if(menuIcon.getAttribute("src") === menuIconPath){
        menuIcon.src = closeIconPath;
    }else{
        menuIcon.src = menuIconPath;
    }

    // Array.from(header).forEach((header) => {
    //     header.classList.toggle("open");
    // });
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
            fetch("https://dummyjson.com/posts?skip=0&limit=150"),
            fetch("https://dummyjson.com/comments?skip=0&limit=340"),
            fetch("https://dummyjson.com/users?skip=0&limit=100")
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

finalPostList.then((postList) => {
    
    postList.forEach(element =>{
        console.log(element);
    })
});
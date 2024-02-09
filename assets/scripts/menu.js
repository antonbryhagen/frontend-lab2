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
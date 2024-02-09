const form = document.getElementById("contact-form");
const submitBtn = document.getElementById("button");
const nameField = document.getElementById("name");
const emailField = document.getElementById("email");
const msgField = document.getElementById("message");
const confirmBox = document.getElementById("confirm");

form.addEventListener('submit', function(event){
    event.preventDefault()

    let errors = [];
    let valid = true;
    
    if(nameField.value === ""){
        valid = false;
        errors.push("Name field can't be empty!");
    }
    if(emailField.value === ""){
        valid = false;
        errors.push("Email field can't be empty!");
    }
    if(msgField.value === ""){
        valid = false;
        errors.push("Message field can't be empty!");
    }
    if(!confirmBox.checked){
        valid = false;
        errors.push("Must check confirm before submit!");
    }

    if(valid){
        form.submit();
    }else{
        let errorMsg = "";
        errors.forEach((error) =>{
            errorMsg = errorMsg + error + "\n";
        })
        alert(errorMsg);
    }
    
})
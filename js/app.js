
//   getting information about session control
let session = new Session();
session = session.getSession();
  // if cookie is created we redirect user on hexa page
if (session !== "") {
  window.location.href = "hexa.html";
  console.log("session");
}
//  popup modal for registration form
document.querySelector("#register_here").addEventListener("click", () => {
  document.querySelector(".custom-modal").style.display = "block";
  document.querySelector(".main-wrapper").style.display = "none";

});
//  closing popup modal for registration form
document.querySelector("#close-modal").addEventListener("click", () => {
  document.querySelector(".custom-modal").style.display = "none";
  document.querySelector(".main-wrapper").style.display = "block";
});
  // creating object with informations for validation form. Sending this object to Validator class like one of two arguments.

const config = {
  register_user_name: {
    required: true,
    minLength: 5,
    maxLength: 40,
  },
  register_email: {
    required: true,
    email: true,
    minLength: 5,
    maxLength: 40,
  },
  register_password: {
    required: true,
    minLength: 5,
    maxLength: 40,
    matching: "register_repet_password",
  },
  register_repet_password: {
    required: true,
    minLength: 5,
    maxLength: 40,
    matching: "register_password",
  },
};
//  Validator of registration form
let validator = new Validator(config, "#registration-form");
// if validation is passed we create new user with method create() inside User class. 
document.querySelector("#registration-form").addEventListener("submit", (e) => {
  e.preventDefault();
  if (validator.validationPassed()) {
    let user = new User();
    let username = document.querySelector("#register_user_name").value;
    let email = document.querySelector("#register_email").value;
    let password = document.querySelector("#register_password").value;
    let data = user.create(username, password, email);
  }
});
  //  when user is created we can login with email and password

document.querySelector("#loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  let email = document.querySelector("#login_email").value;
  let password = document.querySelector("#login_password").value;
  let user = new User();
  user.login(email, password);
});

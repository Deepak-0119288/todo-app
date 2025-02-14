const signin = document.getElementById("sign-in-btn");
const signup = document.getElementById("sign-up-btn");

const welcomeBox = document.querySelector(".welcome-box");
const signinForm = document.querySelector(".sign-in-form");
const signupForm = document.querySelector(".sign-up-form");

console.log(welcomeBox);  

signup.addEventListener("click", () => {
  welcomeBox.style.display = "none";  
  signinForm.style.display = "none";
  signupForm.style.display = "block";
  document.querySelector('.sign-up-form input[type="text"]').focus();
});


signin.addEventListener("click", () => {  
  welcomeBox.style.display = "none";
  signinForm.style.display = "block";
  signupForm.style.display = "none";
  document.querySelector('.sign-in-form input[type="email"]').focus();
});

document.getElementById("form-signup-btn").addEventListener("click", () => {
  const name = document.querySelector('.sign-up-form input[type="text"]').value;
  const email = document.querySelector(
    '.sign-up-form input[type="email"]'
  ).value;
  const password = document.querySelector(
    '.sign-up-form input[type="password"]'
  ).value;

  if (!name || !email || !password) {
    alert("Please fill all the fields in the sign-up form.");
    return;
  }

  document.querySelector('.sign-up-form input[type="text"]').value = "";
  document.querySelector('.sign-up-form input[type="email"]').value = "";
  document.querySelector('.sign-up-form input[type="password"]').value = "";

  const data = { action: "signup", name, password, email };

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        alert(xhr.responseText);
      } else if (xhr.status === 400) {
        alert(xhr.responseText);
      }
    }
  };
  
  xhr.send(JSON.stringify(data));
});

document.getElementById("form-signin-btn").addEventListener("click", () => {
  const email = document.querySelector(
    '.sign-in-form input[type="email"]'
  ).value;
  const password = document.querySelector(
    '.sign-in-form input[type="password"]'
  ).value;

  if (!email || !password) {
    alert("Please fill all the fields in the sign-in form.");
    return;
  }

  document.querySelector('.sign-in-form input[type="email"]').value = "";
  document.querySelector('.sign-in-form input[type="password"]').value = "";

  const data = { action: "signin", email, password };

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        if (xhr.responseURL !== window.location.href) {
          window.location.href = xhr.responseURL;
        } else {
          alert(xhr.responseText);
        }
      } else if (xhr.status === 401) {
        alert(xhr.responseText);
      }
    }
  };

  xhr.send(JSON.stringify(data));
});

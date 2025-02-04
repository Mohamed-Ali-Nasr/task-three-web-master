document.addEventListener("DOMContentLoaded", () => {
  // global variables
  const form = document.querySelector("form");
  const inputEmail = document.querySelector("#email");
  const inputPassword = document.querySelector("#password");
  let loginArray = [];

  // Check if users exist in local storage
  if (localStorage.getItem("users")) {
    loginArray = JSON.parse(localStorage.getItem("users"));
  }

  // Form Submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get the email and password values
    const email = inputEmail.value;
    const password = inputPassword.value;
    const hahedPassword = await hashingPassword(password);

    // Create an object with the email and password
    const credentials = {
      email,
      password: hahedPassword,
    };

    // Check if the email and password are not empty
    if (email !== "" && password !== "") {
      // Check if the users array is not empty
      if (loginArray.length > 0) {
        // Loop through the users array
        for (let i = 0; i < loginArray.length; i++) {
          if (
            loginArray[i].email.toLowerCase() === email.toLowerCase() &&
            loginArray[i].password.toLowerCase() === hahedPassword.toLowerCase()
          ) {
            localStorage.setItem("username", loginArray[i].email);
            location.replace("/welcome.html");
          } else if (
            loginArray[i].email.toLowerCase() === email.toLowerCase() &&
            loginArray[i].password.toLowerCase() !== hahedPassword.toLowerCase()
          ) {
            document.getElementById("error").innerHTML =
              "Invalid Email or password";
            break;
          } else {
            loginArray.push(credentials);
            localStorage.setItem("users", JSON.stringify(loginArray));
            location.replace("/welcome.html");
          }
        }
      } else {
        loginArray.push(credentials);
        localStorage.setItem("users", JSON.stringify(loginArray));
        location.replace("/welcome.html");
      }
    }
  });

  // Hashing Password
  async function hashingPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hash));
    const hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    return hashHex;
  }
});

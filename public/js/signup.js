const signUpForm = document.querySelector(".sign-up-form");

signUpForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(signUpForm);
  const userName = formData.get("userName");
  const email = formData.get("email");
  const password = formData.get("password");
  const avatar = formData.get("avatar");


  const body = { email, password, userName, avatar };
  try {
    const res = await fetch("http://localhost:8080/users", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw res;
    }

    const {
      token,
      user: { id },
    } = await res.json();
    // storage access_token in localStorage:
    localStorage.setItem("COREDUMP_ACCESS_TOKEN", token);
    localStorage.setItem("COREDUMP_CURRENT_USER_ID", id);
    window.location.href = "/main";
  } catch (err) {
    if (err.status >= 400 && err.status < 600) {
      const errorJSON = await err.json();
      const errorsContainer = document.querySelector(".errors-container");
      let errorsHtml = [
        `
        <div class="alert alert-danger">
            Please provide a Username, Email, and Password.
        </div>
      `,
      ];
      console.log(errorJSON);
      const { errors } = errorJSON;
      console.log(errors);
      if (errors && Array.isArray(errors)) {
        errorsHtml = errors.map(
          (message) => `
          <div class="alert alert-danger">
              ${message}
          </div>
        `
        );
      }
      errorsContainer.innerHTML = errorsHtml.join("");
    } else {
      alert(
        "Something went wrong. Please check your internet connection and try again!"
      );
    }
  }
  try {
    const res = await fetch("http://localhost:8080/users/token", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw res;
    }
    const {
      token,
      user: { id },
    } = await res.json();
  }
  catch (err) {
    handleErrors(err);
  }
});

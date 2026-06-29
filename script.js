const views = Array.from(document.querySelectorAll(".view"));
const loginForm = document.getElementById("loginForm");
const userIdInput = document.getElementById("userId");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("errorMessage");
const namePanel = document.getElementById("namePanel");
const backButton = document.getElementById("backButton");

const showView = (target) => {
  views.forEach((view) => {
    view.classList.toggle("is-active", view.dataset.view === target);
  });
};

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const userId = userIdInput.value.trim();
  const password = passwordInput.value.trim();

  if (!userId || !password) {
    errorMessage.textContent = "IDとパスワードを入力してください。";
    return;
  }

  errorMessage.textContent = "";
  namePanel.textContent = `ようこそ ${userId} さん`;
  showView("name");
});

backButton.addEventListener("click", () => {
  passwordInput.value = "";
  showView("login");
  userIdInput.focus();
});

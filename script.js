const AUTH_STORAGE_KEY = "teamCLoggedIn";
const VALID_USERNAME = "user";
const VALID_PASSWORD = "password";

const photoItems = [
  {
    title: "のんびりねこ",
    meta: "ふわっとした毛並みが目を引く、人気の1枚です。",
    src: "https://loremflickr.com/900/1200/animal?lock=1",
    alt: "座ってくつろぐ猫",
  },
  {
    title: "まるいこいぬ",
    meta: "見ているだけでやわらかい気持ちになる投稿です。",
    src: "https://loremflickr.com/900/1200/animal?lock=2",
    alt: "芝生の上の子犬",
  },
  {
    title: "もこもこうさぎ",
    meta: "小さな耳がかわいい、癒やし系の1枚です。",
    src: "https://loremflickr.com/900/1200/animal?lock=3",
    alt: "立ち止まるうさぎ",
  },
  {
    title: "ふわっとパンダ",
    meta: "ゆったりした雰囲気が伝わる、定番の人気投稿です。",
    src: "https://loremflickr.com/900/1200/animal?lock=4",
    alt: "木のそばにいるパンダ",
  },
  {
    title: "きょろきょろふくろう",
    meta: "くりっとした目が印象的で、見返したくなる1枚です。",
    src: "https://loremflickr.com/900/1200/animal?lock=5",
    alt: "枝にとまるふくろう",
  },
  {
    title: "すやすやしろくま",
    meta: "穏やかな表情で、最後に見たくなる投稿です。",
    src: "https://loremflickr.com/900/1200/animal?lock=6",
    alt: "くつろぐしろくま",
  },
];

const recentSearches = ["カフェ", "ランチ", "週末のおでかけ", "穴場スポット"];

const suggestedQueries = [
  "駅近でゆっくりできるカフェ",
  "写真映えするランチスポット",
  "ひとりでも入りやすい店",
];

const recentPosts = ["中目黒の静かなカフェ", "下北沢の週末ランチ", "代々木公園の散歩コース"];

const isAuthed = () => sessionStorage.getItem(AUTH_STORAGE_KEY) === "true";

const setAuthed = () => {
  sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
};

const renderFeed = (homeFeed) => {
  if (!homeFeed) {
    return;
  }

  homeFeed.innerHTML = photoItems
    .map(
      (item) => `
        <article class="photo-card">
          <img src="${item.src}" alt="${item.alt}" loading="lazy" />
          <div class="photo-card__caption">
            <h2 class="photo-card__title">${item.title}</h2>
            <p class="photo-card__meta">${item.meta}</p>
          </div>
        </article>
      `,
    )
    .join("");
};

const renderSearchData = (searchSection) => {
  if (!searchSection) {
    return;
  }

  searchSection.querySelectorAll(".chip-list").forEach((chipList) => {
    chipList.innerHTML = recentSearches.map((item) => `<span class="chip">${item}</span>`).join("");
  });

  const suggestionList = searchSection.querySelector(".search-view .compact");
  if (suggestionList) {
    suggestionList.innerHTML = suggestedQueries
      .map((item) => `<div class="section-item">${item}</div>`)
      .join("");
  }
};

const renderMyPageData = (myPageSection) => {
  if (!myPageSection) {
    return;
  }

  const recentPostList = myPageSection.querySelector('.section-list.compact');
  if (recentPostList) {
    recentPostList.innerHTML = recentPosts
      .map((item) => `<div class="section-item">${item}</div>`)
      .join("");
  }
};

const initLoginPage = () => {
  const loginForm = document.getElementById("loginForm");
  const userIdInput = document.getElementById("userId");
  const passwordInput = document.getElementById("password");
  const passwordToggle = document.getElementById("passwordToggle");
  const errorMessage = document.getElementById("errorMessage");

  if (!loginForm || !userIdInput || !passwordInput || !passwordToggle || !errorMessage) {
    return;
  }

  const setPasswordVisibility = (isVisible) => {
    passwordInput.type = isVisible ? "text" : "password";
    passwordToggle.textContent = isVisible ? "非表示" : "表示";
    passwordToggle.setAttribute("aria-pressed", String(isVisible));
  };

  passwordToggle.addEventListener("click", () => {
    setPasswordVisibility(passwordInput.type === "password");
    passwordInput.focus();
  });

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const userId = userIdInput.value.trim();
    const password = passwordInput.value.trim();

    if (userId === VALID_USERNAME && password === VALID_PASSWORD) {
      errorMessage.textContent = "";
      setAuthed();
      window.location.href = "home.html";
      return;
    }

    setPasswordVisibility(true);
    errorMessage.textContent = "ユーザー名またはパスワードが違います。";
  });

  userIdInput.focus();
};

const initHomePage = () => {
  if (!isAuthed()) {
    return;
  }

  const views = Array.from(document.querySelectorAll(".view"));
  const nav = document.querySelector(".nav");
  const navButtons = Array.from(document.querySelectorAll(".nav button"));
  const homeFeed = document.querySelector("[data-home-feed]");
  const searchSection = document.querySelector(".search-view");
  const myPageSection = document.querySelector(".mypage-view");

  const showView = (target) => {
    views.forEach((view) => {
      view.classList.toggle("is-active", view.dataset.view === target);
    });
  };

  const showApp = (target = "home") => {
    if (nav) {
      nav.hidden = false;
    }

    showView(target);

    navButtons.forEach((button) => {
      const isActive = button.dataset.target === target;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  };

  renderFeed(homeFeed);
  renderSearchData(searchSection);
  renderMyPageData(myPageSection);

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showApp(button.dataset.target);
    });
  });

  showApp("home");
};

initLoginPage();
initHomePage();

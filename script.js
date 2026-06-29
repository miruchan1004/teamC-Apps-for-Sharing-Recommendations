const AUTH_STORAGE_KEY = "teamCLoggedIn";
const USERNAME_STORAGE_KEY = "teamCUsername";
const VALID_USERNAME = "user";
const VALID_PASSWORD = "password";

const photoItems = [
  {
    title: "中目黒の静かなカフェ",
    meta: "朝の時間帯に落ち着いて過ごせる、保存数の多い人気投稿です。",
    src: "https://loremflickr.com/900/1200/cafe?lock=1",
    alt: "落ち着いた雰囲気のカフェの店内",
  },
  {
    title: "下北沢の週末ランチ",
    meta: "写真映えする盛り付けで、コメントが集まっている投稿です。",
    src: "https://loremflickr.com/900/1200/restaurant?lock=2",
    alt: "カジュアルなランチプレート",
  },
  {
    title: "代々木公園の散歩コース",
    meta: "ひとりでも歩きやすいと評判の、保存が増えている投稿です。",
    src: "https://loremflickr.com/900/1200/park?lock=3",
    alt: "緑の多い公園の散歩道",
  },
  {
    title: "代官山の穴場ベーカリー",
    meta: "焼きたてパンが人気で、週末にチェックされる投稿です。",
    src: "https://loremflickr.com/900/1200/bakery?lock=4",
    alt: "ベーカリーのショーケース",
  },
  {
    title: "新宿の夜カフェ",
    meta: "仕事帰りに寄りやすいと保存されている定番スポットです。",
    src: "https://loremflickr.com/900/1200/night,coffee?lock=5",
    alt: "夜の雰囲気があるカフェ",
  },
  {
    title: "横浜の海沿いカフェ",
    meta: "景色も楽しめると話題の、いいね率が高い投稿です。",
    src: "https://loremflickr.com/900/1200/coast,cafe?lock=6",
    alt: "海沿いにあるカフェの風景",
  },
];

const recentSearches = ["カフェ", "ランチ", "週末のおでかけ", "穴場スポット"];

const suggestedQueries = [
  "駅近でゆっくりできるカフェ",
  "写真映えするランチスポット",
  "ひとりでも入りやすい店",
];

const recentPosts = ["中目黒の静かなカフェ", "下北沢の週末ランチ", "代々木公園の散歩コース"];

const likedPosts = ["横浜の海沿いカフェ", "代官山の穴場ベーカリー", "中目黒の静かなカフェ"];

const savedPosts = ["下北沢の週末ランチ", "新宿の夜カフェ", "代々木公園の散歩コース"];

const isAuthed = () => sessionStorage.getItem(AUTH_STORAGE_KEY) === "true";

const setAuthed = (username) => {
  sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
  sessionStorage.setItem(USERNAME_STORAGE_KEY, username);
};

const getStoredUsername = () => sessionStorage.getItem(USERNAME_STORAGE_KEY) || VALID_USERNAME;

const toItemMarkup = (items) =>
  items.map((item) => `<div class="section-item">${item}</div>`).join("");

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

  const username = getStoredUsername();
  const usernameDisplay = myPageSection.querySelector("[data-username]");
  const profileAvatar = myPageSection.querySelector("[data-profile-avatar]");
  const recentPostList = myPageSection.querySelector("[data-recent-list]");
  const likesList = myPageSection.querySelector("[data-likes-list]");
  const savedList = myPageSection.querySelector("[data-saved-list]");

  if (usernameDisplay) {
    usernameDisplay.textContent = `@${username}`;
  }

  if (profileAvatar) {
    profileAvatar.textContent = username.charAt(0).toUpperCase();
  }

  if (recentPostList) {
    recentPostList.innerHTML = toItemMarkup(recentPosts);
  }

  if (likesList) {
    likesList.innerHTML = toItemMarkup(likedPosts);
  }

  if (savedList) {
    savedList.innerHTML = toItemMarkup(savedPosts);
  }
};

const initMyPageLibraryTabs = (myPageSection) => {
  if (!myPageSection) {
    return;
  }

  const tabs = Array.from(myPageSection.querySelectorAll("[data-library-tab]"));
  const panels = Array.from(myPageSection.querySelectorAll("[data-library-panel]"));

  const showPanel = (target) => {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.libraryTab === target;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.libraryPanel === target;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      showPanel(tab.dataset.libraryTab);
    });
  });
};

const initLoginPage = () => {
  const loginForm = document.getElementById("loginForm");
  const userIdInput = document.getElementById("userId");
  const passwordInput = document.getElementById("password");
  const passwordToggle = document.getElementById("passwordToggle");
  const errorMessage = document.getElementById("errorMessage");

  if (!loginForm || !userIdInput || !passwordInput || !errorMessage) {
    return;
  }

  if (passwordToggle) {
    passwordToggle.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";
      passwordToggle.setAttribute("aria-pressed", String(isHidden));
      passwordToggle.classList.toggle("is-visible", isHidden);
      passwordToggle.setAttribute("aria-label", isHidden ? "パスワードを隠す" : "パスワードを表示");
      passwordToggle.setAttribute("title", isHidden ? "パスワードを隠す" : "パスワードを表示");
      passwordInput.focus();
    });
  }

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const userId = userIdInput.value.trim();
    const password = passwordInput.value.trim();

    if (userId === VALID_USERNAME && password === VALID_PASSWORD) {
      errorMessage.textContent = "";
      setAuthed(userId);
      window.location.href = "home.html";
      return;
    }

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
  initMyPageLibraryTabs(myPageSection);

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showApp(button.dataset.target);
    });
  });

  showApp("home");
};

initLoginPage();
initHomePage();

// 대문 인트로(C안 · 잔광): 어둠 속 수평선에서 이름이 떠오르고 사진이 밝아온다.
// 움직임 자체는 styles.css 의 cover-* 애니메이션이고, 여기서는 재생 여부와 건너뛰기만 다룬다.
// 건너뛰기 = 대문에 .skip 을 붙여 애니메이션을 끄는 것. 각 요소의 기본 스타일이 곧 끝 화면이다.

const SEEN_KEY = "mwi-intro-seen";
const INTRO_MS = 3500; // 마지막 요소(스크롤 안내)가 나타날 때까지
const FONT_WAIT_MS = 1500;

/**
 * "play" | "revisit" | "reduced"
 * 처음 열면 재생, 다시 열면 생략(당일 지도를 찾으러 다시 여는 하객용). 주소에 ?intro 를 붙이면 항상 재생한다.
 */
export function introMode() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return "reduced";
  let seen = false;
  try {
    seen = localStorage.getItem(SEEN_KEY) === "1";
    localStorage.setItem(SEEN_KEY, "1");
  } catch {}
  if (new URLSearchParams(location.search).has("intro")) return "play";
  return seen ? "revisit" : "play";
}

/** 인트로에 쓰는 글꼴을 먼저 받아 둔다. 늦으면 기다리지 않고 시작한다 */
export function waitForFonts(sample) {
  const fonts = ['500 25px "Noto Serif KR"', '400 14px "Noto Serif KR"', 'italic 400 21px "Cormorant Garamond"'].map((f) =>
    document.fonts.load(f, sample),
  );
  return Promise.race([Promise.allSettled(fonts), new Promise((r) => setTimeout(r, FONT_WAIT_MS))]);
}

export function startIntro(app, mode) {
  const cover = app.querySelector(".cover");
  if (mode !== "play") {
    cover.classList.add("skip");
    if (mode === "revisit") app.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 450, easing: "ease-out" });
    return;
  }

  const events = ["pointerdown", "wheel", "touchmove", "keydown"];
  const skip = () => {
    cover.classList.add("skip");
    stop();
  };
  const onScroll = () => {
    if (scrollY > 8) skip();
  };
  const stop = () => {
    events.forEach((t) => removeEventListener(t, skip));
    removeEventListener("scroll", onScroll);
    clearTimeout(timer);
  };
  events.forEach((t) => addEventListener(t, skip, { passive: true }));
  addEventListener("scroll", onScroll, { passive: true });
  const timer = setTimeout(stop, INTRO_MS);
}

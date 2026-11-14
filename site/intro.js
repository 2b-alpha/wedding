// 대문 인트로(C안 · 잔광): 어둠 속 수평선에서 이름이 떠오르고 사진이 밝아온다.
// 움직임 자체는 styles.css 의 cover-* 애니메이션이고, 여기서는 재생 여부와 건너뛰기만 다룬다.
// 건너뛰기 = 대문에 .skip 을 붙여 애니메이션을 끄는 것. 각 요소의 기본 스타일이 곧 끝 화면이다.
// 열 때마다 재생하고, 탭·스와이프하면 바로 끝 화면으로 넘어간다.

const INTRO_MS = 3500; // 마지막 요소(스크롤 안내)가 나타날 때까지
const FONT_WAIT_MS = 1500;

/** "play" | "reduced" — 기기에서 '동작 줄이기'를 켰으면 움직임 없이 끝 화면만 */
export function introMode() {
  return matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduced" : "play";
}

/** 재생할 때는 맨 위에서 시작한다. 새로고침 때 브라우저가 스크롤 위치를 되살리면 대문을 못 본다 */
export function prepareIntro(mode) {
  if (mode !== "play") return;
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  scrollTo(0, 0);
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
    return;
  }

  // 사람이 직접 만진 경우에만 건너뛴다. scroll 이벤트는 브라우저가 위치를 되살릴 때도 와서 쓰지 않는다
  const events = ["pointerdown", "wheel", "touchmove", "keydown"];
  const skip = () => {
    cover.classList.add("skip");
    stop();
  };
  const stop = () => {
    events.forEach((t) => removeEventListener(t, skip));
    clearTimeout(timer);
  };
  events.forEach((t) => addEventListener(t, skip, { passive: true }));
  const timer = setTimeout(stop, INTRO_MS);
}

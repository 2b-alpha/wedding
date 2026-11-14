// 대문 인트로(C안 · 잔광): 어둠 속 수평선에서 이름이 떠오르고 사진이 밝아온다.
// 움직임 자체는 styles.css 의 cover-* 애니메이션이고, 열 때마다 끝까지 재생한다(스크롤·탭으로 멈추지 않는다).
// '동작 줄이기'를 켠 기기는 styles.css 가 애니메이션을 꺼서 끝 화면만 보인다.

const FONT_WAIT_MS = 1500;

/** 인트로 재생 전 준비: 맨 위에서 시작하고, 인트로 글꼴을 먼저 받아 둔다(늦으면 기다리지 않는다) */
export async function prepareIntro(sample) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  // 새로고침 때 브라우저가 스크롤 위치를 되살리면 대문을 못 본다
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  scrollTo(0, 0);
  // 글꼴이 늦게 오면 애니메이션 도중에 글꼴이 바뀌어 보인다
  const fonts = ['500 25px "Noto Serif KR"', '400 14px "Noto Serif KR"', '700 100px "Noto Serif KR"', 'italic 400 21px "Cormorant Garamond"'].map((f) =>
    document.fonts.load(f, sample),
  );
  await Promise.race([Promise.allSettled(fonts), new Promise((r) => setTimeout(r, FONT_WAIT_MS))]);
}

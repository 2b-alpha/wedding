// 앨범 사진 크게 보기: 좌우로 밀거나 화살표로 넘긴다
import { placeholderStyle } from "./sections.js";

const SWIPE_PX = 50;

export function initLightbox(root, items) {
  if (!items.length) return;

  const dlg = document.createElement("dialog");
  dlg.className = "lightbox";
  dlg.setAttribute("aria-label", "사진 크게 보기");
  dlg.innerHTML = `
<div class="lb-stage"></div>
<p class="lb-count" aria-live="polite"></p>
<button type="button" class="lb-close" aria-label="닫기">×</button>
<button type="button" class="lb-prev" aria-label="이전 사진">‹</button>
<button type="button" class="lb-next" aria-label="다음 사진">›</button>`;
  document.body.append(dlg);

  const stage = dlg.querySelector(".lb-stage");
  const count = dlg.querySelector(".lb-count");
  let index = 0;

  const preload = (i) => {
    const item = items[(i + items.length) % items.length];
    if (!item.placeholder) new Image().src = item.src;
  };

  function show(i) {
    index = (i + items.length) % items.length;
    const item = items[index];
    stage.innerHTML = item.placeholder
      ? `<div class="lb-ph" style="${placeholderStyle(item)}">${index + 1}</div>`
      : `<img src="${item.src}" alt="">`;
    count.textContent = `${index + 1} / ${items.length}`;
    preload(index + 1);
    preload(index - 1);
  }

  root.addEventListener("click", (e) => {
    const tile = e.target.closest(".tile");
    if (!tile) return;
    show(Number(tile.dataset.index));
    dlg.showModal();
    document.documentElement.classList.add("lock");
  });

  dlg.querySelector(".lb-close").addEventListener("click", () => dlg.close());
  dlg.querySelector(".lb-prev").addEventListener("click", () => show(index - 1));
  dlg.querySelector(".lb-next").addEventListener("click", () => show(index + 1));
  dlg.addEventListener("close", () => document.documentElement.classList.remove("lock"));
  dlg.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });

  // 밀어서 넘기기: 손가락을 따라 움직이다가 일정 거리를 넘으면 넘긴다
  let startX = null;
  stage.addEventListener("pointerdown", (e) => {
    startX = e.clientX;
    stage.setPointerCapture(e.pointerId);
    stage.classList.add("dragging");
  });
  stage.addEventListener("pointermove", (e) => {
    if (startX === null) return;
    stage.firstElementChild.style.transform = `translateX(${e.clientX - startX}px)`;
  });
  const end = (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    stage.classList.remove("dragging");
    if (dx <= -SWIPE_PX) show(index + 1);
    else if (dx >= SWIPE_PX) show(index - 1);
    else stage.firstElementChild.style.transform = "";
  };
  stage.addEventListener("pointerup", end);
  stage.addEventListener("pointercancel", end);
}

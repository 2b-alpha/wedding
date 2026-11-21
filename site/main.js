import config from "./config.js";
import { variantNav } from "./covers.js";
import { countdown, weddingInstant } from "./dates.js";
import { prepareIntro } from "./intro.js";
import { initLightbox } from "./lightbox.js";
import { initRsvp } from "./rsvp.js";
import { galleryItems, renderPage } from "./sections.js";
import { copyText, toast } from "./ui.js";

const app = document.getElementById("app");
const { groom, bride } = config.couple;
await prepareIntro(`${groom.name}${bride.name}&Save the date 0123456789. SAT 오전오후낮시분 ${config.venue.name}${config.venue.address}${config.venue.hall}`);
// 대문 시안 비교용 페이지(/A/ ~ /H/)는 <html data-variant> 로 시안을 정한다. 기본 주소는 A
const variant = document.documentElement.dataset.variant;
app.innerHTML = renderPage(config, new Date(), variant ?? "A");
if (variant) document.body.insertAdjacentHTML("beforeend", variantNav(variant));

initRsvp(app, config);
initLightbox(app, galleryItems(config.gallery));
initCountdown();

app.addEventListener("click", async (e) => {
  const copyBtn = e.target.closest("[data-copy]");
  if (copyBtn) {
    const ok = await copyText(copyBtn.dataset.copy);
    toast(ok ? copyBtn.dataset.toast : "복사하지 못했습니다. 길게 눌러 직접 복사해 주세요.");
    return;
  }
  if (e.target.closest("[data-copy-link]")) {
    const ok = await copyText(location.origin + location.pathname);
    toast(ok ? "청첩장 링크를 복사했습니다" : "복사하지 못했습니다");
    return;
  }
  const more = e.target.closest("[data-more]");
  if (more) {
    app.querySelector(".gallery").classList.add("expanded");
    more.remove();
  }
});

function initCountdown() {
  const box = app.querySelector("[data-countdown]");
  const target = weddingInstant(config.wedding.date, config.wedding.time);
  const units = Object.fromEntries([...box.querySelectorAll("[data-unit]")].map((el) => [el.dataset.unit, el]));
  const tick = () => {
    const left = countdown(target, Date.now());
    if (!left) {
      box.remove();
      clearInterval(timer);
      return;
    }
    for (const [key, el] of Object.entries(units)) el.textContent = key === "days" ? left[key] : String(left[key]).padStart(2, "0");
  };
  const timer = setInterval(tick, 1000);
  tick();
}

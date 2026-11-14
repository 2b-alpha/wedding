// 참석 의사 입력창(아래에서 올라오는 시트)
import { toast } from "./ui.js";

const radios = (name, options, { required = false, checked } = {}) =>
  `<div class="seg-opts">${options
    .map(
      ([value, label], i) =>
        `<label><input type="radio" name="${name}" value="${value}"${required && i === 0 ? " required" : ""}${value === checked ? " checked" : ""}><span>${label}</span></label>`,
    )
    .join("")}</div>`;

function formHtml(r) {
  const companions = Array.from({ length: r.maxCompanions + 1 }, (_, n) => `<option value="${n}">${n === 0 ? "없음" : `${n}명`}</option>`).join("");
  return `
<div class="sheet-head">
  <h3>참석 의사 전달</h3>
  <button type="button" class="icon-btn" data-close aria-label="닫기">×</button>
</div>
<form class="form">
  <fieldset><legend>어느 분의 하객이신가요?</legend>${radios("side", [["신랑측", "신랑측"], ["신부측", "신부측"]], { required: true })}</fieldset>
  <fieldset><legend>참석 여부</legend>${radios("attending", [["참석", "참석할게요"], ["불참", "참석이 어려워요"]], { required: true })}</fieldset>
  <label class="field"><span>성함</span><input name="name" required maxlength="20" autocomplete="name"></label>
  ${r.askPhone ? `<label class="field"><span>연락처</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="20"></label>` : ""}
  <fieldset class="attend-only" disabled>
    <label class="field"><span>동반 인원 <small>본인 제외</small></span><select name="companions">${companions}</select></label>
    <fieldset><legend>식사</legend>${radios("meal", [["예정", "할게요"], ["안 함", "안 해요"], ["미정", "미정"]], { checked: "미정" })}</fieldset>
  </fieldset>
  <label class="field"><span>남기실 말 <small>선택</small></span><textarea name="note" rows="3" maxlength="200"></textarea></label>
  <p class="privacy">남겨 주신 정보는 좌석 준비에만 쓰고 예식이 끝나면 지웁니다.</p>
  <button type="submit" class="btn btn-block">전달하기</button>
</form>`;
}

const doneHtml = (preview) => `
<div class="sheet-head">
  <h3>참석 의사 전달</h3>
  <button type="button" class="icon-btn" data-close aria-label="닫기">×</button>
</div>
<div class="sheet-done">
  <p class="done-title">전달해 주셔서 감사합니다</p>
  <p class="done-sub">${preview ? "미리보기라 실제로 저장되지는 않았습니다." : "정성껏 자리를 준비하겠습니다."}</p>
  <button type="button" class="btn btn-block" data-close>닫기</button>
</div>`;

/** 응답 저장. 구글 스프레드시트(Apps Script 웹 앱)는 CORS 응답을 주지 않아 no-cors 로 보내고 결과는 확인하지 않는다 */
async function submit(endpoint, data) {
  await fetch(endpoint, { method: "POST", mode: "no-cors", body: new URLSearchParams(data) });
}

export function initRsvp(root, config) {
  const openBtn = root.querySelector("[data-open-rsvp]");
  if (!openBtn) return; // 마감 후에는 버튼이 없다
  const r = config.rsvp;

  const dlg = document.createElement("dialog");
  dlg.className = "sheet";
  dlg.setAttribute("aria-label", "참석 의사 전달");
  document.body.append(dlg);

  const reset = () => {
    dlg.innerHTML = formHtml(r);
    const form = dlg.querySelector("form");
    const attendOnly = form.querySelector(".attend-only");
    form.addEventListener("change", (e) => {
      if (e.target.name === "attending") attendOnly.disabled = e.target.value !== "참석";
    });
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const button = form.querySelector("[type=submit]");
      const data = { ...Object.fromEntries(new FormData(form)), submittedAt: new Date().toISOString() };
      button.disabled = true;
      try {
        if (r.endpoint) await submit(r.endpoint, data);
        dlg.innerHTML = doneHtml(!r.endpoint);
      } catch {
        button.disabled = false;
        toast("전달하지 못했습니다. 잠시 후 다시 시도해 주세요.");
      }
    });
  };

  openBtn.addEventListener("click", () => {
    if (!dlg.querySelector("form")) reset(); // 제출 뒤 다시 열면 빈 폼부터
    dlg.showModal();
    document.documentElement.classList.add("lock");
  });
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg || e.target.closest("[data-close]")) dlg.close();
  });
  dlg.addEventListener("close", () => document.documentElement.classList.remove("lock"));
}

// 여러 섹션이 같이 쓰는 작은 도구: 알림(토스트), 클립보드 복사

let hideTimer;

/** 화면 아래에 잠깐 뜨는 알림. 열린 창(dialog)이 있으면 그 위에 띄운다 */
export function toast(message) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
  }
  // 모달 dialog 는 최상위 레이어라 body 에 붙은 알림을 가린다
  (document.querySelector("dialog[open]") ?? document.body).append(el);
  el.textContent = message;
  requestAnimationFrame(() => el.classList.add("show"));
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => el.classList.remove("show"), 1800);
}

/** 클립보드에 복사. 성공하면 true */
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // 일부 인앱 브라우저는 clipboard API 를 막는다
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:0;opacity:0";
    document.body.append(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {}
    ta.remove();
    return ok;
  }
}

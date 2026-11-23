// J안(프레스코): 대문부터 끝까지 한 벌인 시안. 유화 느낌의 그림 위에 올리브색 글자를 얹는다.
// 내용은 다른 시안과 같은 config.js 를 쓰고, 앨범·오시는 길·안내·계좌·참석 섹션은 sections.js 것을 그대로 쓴다. 여기서는
//   1) 순서를 정하고 J안에만 있는 섹션(대문·카운트다운·올리브 패널·달력과 예식 순서·사진 아치)을 짜고
//   2) 공용 섹션에 그림(창문·화환·꽃가지)을 얹고
//   3) 봉투를 열고, 스크롤에 맞춰 내용을 떠오르게 한다.
// 모양은 theme-j.css, 그림·영상은 j-art/ 폴더.
// j-art/ 의 그림과 영상은 The Digital Yes 의 "Fresco" 템플릿 것이다. 시안 비교용으로만 넣었고,
// 실제로 내보내려면 템플릿을 구매하거나 그림을 바꿔야 한다.
import { daysUntil, formatDateKo, formatTimeKo, monthGrid, weekday } from "./dates.js";
import { asset, esc, lines } from "./html.js";
import { head, sections } from "./sections.js";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKDAYS_KO = ["일", "월", "화", "수", "목", "금", "토"];

/** 예식 순서의 icon 이름 → 그림 파일. 모르는 이름이면 그림 없이 글자만 나온다 */
const PROGRAM_ART = {
  door: "arch",
  rings: "dance",
  camera: "party",
  meal: "plate",
  toast: "glasses",
  cake: "cake",
  drink: "spritz",
  party: "discoball",
  night: "moon",
};

const art = (name) => asset(`j-art/${name}`);
/** 장식 그림. 화면 낭독기는 건너뛴다 */
const pic = (name, cls, lazy = true) =>
  `<img class="${cls}" src="${art(`${name}.webp`)}" alt="" aria-hidden="true" draggable="false"${lazy ? ' loading="lazy"' : ""}>`;
const heart = `<svg class="h-heart" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
const chevron = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`;

const venueLine = (v) => (v.name ? `${v.name} ${v.hall}` : `${v.address}, ${v.hall}`);

/** 대문: 그림 속 종이 카드에 이름·날짜·장소. 처음에는 봉투가 덮고 있다가 눌리면 열린다 (initEnvelope) */
function hero(c) {
  const { groom, bride } = c.couple;
  const [y, m, d] = c.wedding.date.split("-").map(Number);
  const day = weekday(c.wedding.date);
  return `
<section id="cover" class="h-hero">
  <video class="h-hero-bg" src="${art("hero.mp4")}" poster="${art("hero.jpg")}" autoplay loop muted playsinline aria-hidden="true"></video>
  <div class="h-hero-card">
    <h1 class="h-hero-names"><span>${esc(groom.name)}</span><em>&amp;</em><span>${esc(bride.name)}</span></h1>
    <p class="h-caps h-hero-invite">We invite you to<br>celebrate our wedding</p>
    <div class="h-hero-date">
      ${pic("bud", "h-bud h-bud-l", false)}${pic("bud", "h-bud h-bud-r", false)}
      <span class="h-caps">${MONTHS[m - 1]}</span><b>${d}</b><span class="h-caps">${WEEKDAYS[day]}</span><span class="h-caps">${y}</span>
    </div>
    <p class="h-hero-when">${WEEKDAYS_KO[day]}요일 ${formatTimeKo(c.wedding.time)}</p>
    <p class="h-hero-where">${esc(venueLine(c.venue))}</p>
  </div>
  <a class="h-scroll" href="#countdown" aria-label="아래로 내려가기"><span>${chevron}</span></a>
  <button type="button" class="h-env" data-h-envelope aria-label="봉투를 눌러 청첩장 열기">
    <img class="h-env-poster" src="${art("envelope.jpg")}" alt="" draggable="false">
    <video class="h-env-video" src="${art("envelope.mp4")}" muted playsinline preload="auto"></video>
    <span class="h-env-hint">눌러서 열어 주세요</span>
  </button>
</section>`;
}

/** 꽃 액자 안의 카운트다운. 숫자는 main.js 의 initCountdown 이 data-unit 을 찾아 채운다 */
function countdown(c) {
  const unit = (key, label) => `<div><b data-unit="${key}">0</b><span>${label}</span></div>`;
  return `
<section id="countdown" class="sec h-countdown">
  ${head("Countdown", `${formatDateKo(c.wedding.date)}까지`)}
  <div class="h-frame">
    ${pic("frame", "h-frame-img")}
    <div class="h-cd" data-countdown>
      <div class="h-cd-days">${unit("days", "Days")}</div>
      <div class="h-cd-rest">${unit("hours", "Hours")}${unit("minutes", "Minutes")}${unit("seconds", "Seconds")}</div>
    </div>
  </div>
</section>`;
}

/** 인사말: 구름 아래로 글이 이어지고 손글씨 서명으로 끝난다 */
function greeting(c) {
  const { groom, bride } = c.couple;
  const family = (p) =>
    p.parents.length
      ? `<p class="family"><span>${p.parents.map(esc).join(" · ")}</span><small>의 ${esc(p.relation)}</small><b>${esc(p.short)}</b></p>`
      : "";
  const families = family(groom) + family(bride);
  const paragraphs = c.greeting.text
    .split(/\n{2,}/)
    .map((p) => `<p>${lines(p)}</p>`)
    .join("");
  return `
<section id="greeting" class="sec h-story">
  <div class="h-clouds h-decor">${pic("clouds", "", false)}</div>
  ${head("Invitation", "소중한 분들을 초대합니다")}
  <div class="h-story-text">${paragraphs}</div>
  ${families ? `<div class="families">${families}</div>` : ""}
  <p class="h-sign">${esc(groom.short)}<span>and</span>${esc(bride.short)}</p>
</section>`;
}

/** 올리브 패널: 분수 정원 아래 금빛 액자 안에 예식 장소와 시각 */
function celebration(c) {
  const v = c.venue;
  return `
<section id="celebration" class="h-olive">
  <div class="h-olive-edge h-decor" aria-hidden="true"></div>
  ${pic("fountain", "h-fountain h-decor")}
  <header class="sec-head h-olive-head"><p class="eyebrow">The Celebration</p><h2>예식 안내</h2></header>
  <div class="h-olive-frame">
    <h3>${esc(v.name || v.address)}</h3>
    <p class="h-caps">${esc(v.hall)}</p>
    ${v.name ? `<p class="h-olive-addr">${esc(v.address)}</p>` : ""}
    <p class="h-olive-date">${formatDateKo(c.wedding.date)}</p>
    <p class="h-olive-time">${formatTimeKo(c.wedding.time)}</p>
    <a class="h-btn h-btn-light" href="#location">오시는 길</a>
  </div>
</section>
<div class="h-villa h-decor">${pic("villa", "")}</div>`;
}

/** 달력(예식 날에 하트)과 예식 순서. config.program 이 비어 있으면 달력만 나온다 */
function day(c, now) {
  const { date, time } = c.wedding;
  const [y, m, d] = date.split("-").map(Number);
  const week = WEEKDAYS_KO.map((w, i) => `<span class="wk${i === 0 ? " sun" : ""}">${w}</span>`).join("");
  const cells = monthGrid(y, m)
    .flat()
    .map((n, i) => {
      if (n === null) return "<span></span>";
      if (n === d) return `<span class="on">${heart}<i>${n}</i></span>`;
      return `<span${i % 7 === 0 ? ' class="sun"' : ""}>${n}</span>`;
    })
    .join("");
  const left = daysUntil(date, now);
  const who = `${esc(c.couple.groom.short)} ♥ ${esc(c.couple.bride.short)}`;
  const note = left > 0 ? `${who}의 결혼식이 ${left}일 남았습니다` : left === 0 ? `오늘은 ${who}의 결혼식 날입니다` : `${who}의 결혼식이 ${-left}일 지났습니다`;
  const items = (c.program ?? [])
    .map((it) => {
      const name = PROGRAM_ART[it.icon];
      return `<li>
      <span class="h-tl-dot">${heart}</span>
      <div class="h-tl-text"><time>${esc(it.time)}</time><p>${esc(it.title)}</p></div>
      ${name ? `<div class="h-tl-art">${pic(name, "")}</div>` : ""}
    </li>`;
    })
    .join("");
  return `
<section id="calendar" class="sec h-day">
  ${head("The Day", `${formatDateKo(date)} ${formatTimeKo(time)}`)}
  <p class="h-note">${note}</p>
  <div class="h-cal">
    <p class="h-cal-month">${MONTHS[m - 1]} <span>${y}</span></p>
    <div class="h-cal-grid">${week}${cells}</div>
  </div>
  ${items ? `<ol class="h-tl">${items}</ol>` : ""}
</section>`;
}

/** 타일 띠. 잎사귀 다섯 겹이 번갈아 흐려졌다 돌아온다 */
const tiles = () => `
<div class="h-tiles h-decor" aria-hidden="true">
  <div>${pic("tiles", "")}${[1, 2, 3, 4, 5].map((i) => pic(`leaf-${i}`, "h-leaf")).join("")}</div>
</div>`;

/** 사진 아치: 대문 사진을 금빛 아치 안에 담고, 위아래에 꽃 장식을 두르고 꽃잎을 날린다 */
function portrait(c) {
  const photo = c.cover.photo ? asset(c.cover.photo) : "";
  const inner = photo
    ? `<div class="ph-bg h-arch-photo" style="background-image:url('${esc(photo)}')"></div>`
    : `<div class="ph-bg is-empty h-arch-photo"><span class="ph-label">대문 사진 (세로)</span></div>`;
  // [왼쪽 %, 떨어지는 시간, 시작 지연, 그림, 폭, 흔들리는 시간]
  const petals = [
    [12, 14, 0, 1, 26, 3.2],
    [26, 17, 4.5, 2, 20, 2.6],
    [38, 15, 8, 3, 30, 3.8],
    [50, 18, 2, 1, 22, 3],
    [62, 14.5, 10.5, 2, 27, 3.4],
    [74, 17.5, 6.5, 3, 19, 2.8],
    [86, 15.5, 12.5, 1, 24, 3.6],
  ]
    .map(
      ([x, fall, delay, n, w, sway]) =>
        `<i style="left:${x}%;animation-duration:${fall}s;animation-delay:${delay}s"><img src="${art(`petal-${n}.webp`)}" alt="" style="width:${w}px;animation-duration:${sway}s;animation-delay:${+(delay * 0.7).toFixed(2)}s"></i>`,
    )
    .join("");
  return `
<section id="portrait" class="h-portrait">
  <div class="h-arch">
    ${pic("arch-panel", "h-arch-panel")}
    ${inner}
    ${c.cover.sampleLabel ? `<span class="h-sample">${esc(c.cover.sampleLabel)}</span>` : ""}
    ${pic("garland-top", "h-garland-top")}
    <div class="h-petals" aria-hidden="true">${petals}</div>
    ${pic("garland-bottom", "h-garland-bottom")}
  </div>
</section>`;
}

/** 끝: 꽃 기둥 문 사이로 이름과 날짜 */
function footer(c) {
  const { groom, bride } = c.couple;
  const [y, m, d] = c.wedding.date.split("-").map(Number);
  return `
<footer class="footer h-footer">
  <div class="h-gate">
    ${pic("gate", "")}
    <div class="h-gate-names"><p>${esc(groom.name)}</p><em>&amp;</em><p>${esc(bride.name)}</p><small>${y}. ${m}. ${d}.</small></div>
  </div>
  <button type="button" class="btn btn-ghost" data-copy-link>청첩장 링크 복사</button>
</footer>`;
}

/** J안 페이지 전체. 섹션 순서는 여기서 바꾼다 */
export function renderPageJ(c, now = new Date()) {
  const s = sections;
  return [
    hero(c),
    countdown(c),
    greeting(c),
    celebration(c),
    day(c, now),
    tiles(),
    portrait(c),
    s.gallery(c),
    s.location(c),
    s.guide(c),
    s.accounts(c),
    s.rsvp(c, now),
    footer(c),
  ].join("");
}

/** 봉투: 누르면 영상이 재생되고, 끝나면 걷히며 대문 글자가 떠오른다. 한 번 더 누르면 건너뛴다.
 *  닫혀 있는 동안은 아래 내용이 먼저 보이지 않게 스크롤을 잠근다 */
function initEnvelope(app) {
  const env = app.querySelector("[data-h-envelope]");
  if (!env) return;
  const hero = env.closest(".h-hero");
  const video = env.querySelector("video");
  const root = document.documentElement;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (still) hero.querySelector(".h-hero-bg").pause();
  root.classList.add("lock");
  scrollTo(0, 0);

  let stage = "closed"; // closed → playing → open
  let fallback;
  const finish = () => {
    if (stage === "open") return;
    stage = "open";
    clearTimeout(fallback);
    hero.classList.add("is-open");
    root.classList.remove("lock");
    setTimeout(() => {
      env.remove();
    }, 1000);
  };
  env.addEventListener("click", () => {
    if (stage !== "closed" || still) return finish();
    stage = "playing";
    hero.classList.add("is-playing");
    video.addEventListener("ended", finish, { once: true });
    video.addEventListener("error", finish, { once: true });
    // 영상이 끝났다는 신호가 안 오는 브라우저를 위한 안전장치 (영상 길이 약 8초)
    fallback = setTimeout(finish, 9500);
    video.play().catch(finish);
  });
}

/** 공용 섹션에 J안 그림을 얹는다 */
function decorate(app) {
  // 앨범·오시는 길: 제목 옆 꽃잎
  for (const id of ["gallery", "location"]) app.querySelector(`#${id} .sec-head`)?.insertAdjacentHTML("afterbegin", pic("petal-white", "h-title-petal h-decor"));

  // 오시는 길: 제목 아래 내용을 꽃가지가 걸친 카드 하나로 묶는다
  const loc = app.querySelector("#location");
  if (loc) {
    const card = document.createElement("div");
    card.className = "h-card";
    card.append(...[...loc.children].filter((el) => !el.matches(".sec-head")));
    card.insertAdjacentHTML(
      "afterbegin",
      `<span class="h-badge">Wedding Venue</span>${pic("blossom-1", "h-bl h-bl-1")}${pic("blossom-2", "h-bl h-bl-2")}${pic("petal-cream", "h-bl h-bl-3")}`,
    );
    loc.append(card);
  }

  // 예식 안내: 하객 그림
  app.querySelector("#guide .sec-head")?.insertAdjacentHTML("afterend", `<div class="h-party h-decor">${pic("party", "")}</div>`);

  // 계좌: 안내 글을 화환 안에 넣고, 계좌 묶음에 꽃가지를 얹는다
  const acc = app.querySelector("#account");
  const msg = acc?.querySelector(".body-text");
  if (msg) {
    const wreath = document.createElement("div");
    wreath.className = "h-wreath";
    wreath.innerHTML = pic("wreath", "");
    msg.replaceWith(wreath);
    wreath.append(msg);
    acc.querySelector(".acc")?.insertAdjacentHTML("afterbegin", `${pic("blossom-4", "h-bl h-bl-top")}${pic("blossom-3", "h-bl h-bl-4")}${pic("blossom-5", "h-bl h-bl-5")}`);
  }

  // 참석 의사: 창문 그림과 제목 아래 마름모 장식
  const rsvpHead = app.querySelector("#rsvp .sec-head");
  if (rsvpHead) {
    rsvpHead.insertAdjacentHTML("beforebegin", `<div class="h-window h-decor">${pic("window", "")}</div>`);
    rsvpHead.insertAdjacentHTML("beforeend", `<span class="h-diamond" aria-hidden="true"><i></i></span>`);
  }
}

export function initThemeJ(app) {
  decorate(app);
  initEnvelope(app);

  // 대문의 내려가기 버튼: 주소에 #countdown 을 남기지 않고 부드럽게 내려간다
  app.querySelector(".h-scroll")?.addEventListener("click", (e) => {
    e.preventDefault();
    app.querySelector("#countdown")?.scrollIntoView({ behavior: "smooth" });
  });

  // 스크롤에 맞춰 떠오르기. 대문은 봉투가 열릴 때 제 순서로 나타나고, 장식 그림은 늘 보인다
  if (!("IntersectionObserver" in window)) return;
  const targets = [...app.querySelectorAll(".sec > *, .h-olive > *, .h-footer > *, .h-arch")].filter((el) => !el.matches(".h-decor"));
  for (const el of targets) el.classList.add("h-rv");
  const io = new IntersectionObserver(
    (entries) => {
      entries
        .filter((e) => e.isIntersecting)
        .forEach((e, i) => {
          e.target.style.transitionDelay = `${Math.min(i, 5) * 90}ms`;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
  );
  for (const el of targets) io.observe(el);
}

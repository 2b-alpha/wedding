// 대문(첫 화면) 시안 A~H.
// 기본 주소(/wedding/)는 A, 비교용 주소는 /wedding/A/ ~ /wedding/H/ (폴더마다 index.html 에 data-variant 가 있다).
// 하나로 정해지면 나머지 시안, 비교용 폴더, variantNav 를 지운다.
// 움직임은 covers.css 에 있다. 요소의 기본 스타일이 인트로가 끝난 화면이고, 애니메이션은 시작 상태에서 그리로 온다.
import { formatDotEn, formatTimeKo } from "./dates.js";
import { asset, esc } from "./html.js";
import { renderLettering } from "./lettering.js";

// J(프레스코)는 페이지 전체가 한 벌이고 대문도 theme-j.js 가 짠다. 여기에는 시안 이동 표시에 쓸 이름만 둔다
export const COVER_NAMES = { A: "잔광", B: "필름", C: "문", D: "인화", E: "아치", F: "글자", G: "The Wedding", H: "Save the Date", J: "프레스코" };

const venueLine = (v) => (v.name ? `${v.name} ${v.hall}` : `${v.address}, ${v.hall}`);
const hint = `<svg class="cover-hint" viewBox="0 0 20 12" aria-hidden="true"><path d="M2 2l8 8 8-8"/></svg>`;
/** 나중에 떠오르는 요소: 클래스와 등장 시각(초) */
const fu = (cls, d) => `class="${cls} fu" style="--d:${+d.toFixed(2)}s"`;
const cta = (d, dark = false) =>
  `<div ${fu("cover-cta", d)}><a class="pill ${dark ? "pill-dark" : "pill-light"}" href="#location">오시는 길</a></div>`;

function parts(c) {
  const { groom, bride } = c.couple;
  const photo = c.cover.photo ? asset(c.cover.photo) : "";
  const bgStyle = photo ? `style="background-image:url('${esc(photo)}')"` : "";
  const [y, m, d] = c.wedding.date.split("-");
  return {
    groom: groom.name,
    bride: bride.name,
    names: `<span>${esc(groom.name)}<em>&amp;</em>${esc(bride.name)}</span>`,
    shortNames: `${esc(groom.short)}<span>&amp;</span>${esc(bride.short)}`,
    when: `${formatDotEn(c.wedding.date)} · ${formatTimeKo(c.wedding.time)}`,
    where: esc(venueLine(c.venue)),
    ymd: [y, m, d],
    bgStyle,
    emptyCls: photo ? "" : " is-empty",
    /** 사진 칸. 사진이 없으면 그라데이션과 안내 글자 */
    ph: (cls) =>
      photo
        ? `<div class="ph-bg ${cls}" ${bgStyle}></div>`
        : `<div class="ph-bg is-empty ${cls}"><span class="ph-label">대문 사진 (세로)</span></div>`,
    sample: c.cover.sampleLabel ? `<span class="cover-sample">${esc(c.cover.sampleLabel)}</span>` : "",
  };
}

const VARIANTS = {
  // A · 잔광: 어둠 속 수평선에서 이름이 떠오르고, 사진이 원형으로 열린 뒤 이름이 제자리로 내려간다
  A: (p) => `
<section id="cover" class="cover cv-A">
  ${p.ph("cover-photo")}
  <div class="cover-shade"></div>
  <div class="a-glow" aria-hidden="true"></div>
  <div class="a-line" aria-hidden="true"></div>
  <p ${fu("cover-eyebrow", 2.1)}>Save the date</p>
  <h1 class="cover-names">${p.names}</h1>
  <p ${fu("cover-when", 2.2)}>${p.when}</p>
  <p ${fu("cover-where", 2.3)}>${p.where}</p>
  ${cta(2.45)}
  ${hint}${p.sample}
</section>`,

  // B · 필름: 흐린 사진이 선명해지며 천천히 물러나고, 위아래 검은 띠가 열린 뒤 이름이 한 글자씩 맺힌다
  B: (p) => {
    const g = [...p.groom];
    const letter = (ch, i) => `<i style="--i:${i}">${esc(ch)}</i>`;
    const names = `<span>${g.map(letter).join("")}<em style="--i:${g.length}">&amp;</em>${[...p.bride]
      .map((ch, i) => letter(ch, g.length + 1 + i))
      .join("")}</span>`;
    return `
<section id="cover" class="cover cv-B" style="--hint-d:3.3s">
  ${p.ph("cover-photo")}
  <div class="cover-shade"></div>
  <div class="b-bar b-top" aria-hidden="true"></div>
  <div class="b-bar b-bottom" aria-hidden="true"></div>
  <p ${fu("cover-eyebrow", 1.8)}>Our Wedding Day</p>
  <h1 class="cover-names">${names}</h1>
  <p ${fu("cover-when", 2.6)}>${p.when}</p>
  <p ${fu("cover-where", 2.7)}>${p.where}</p>
  ${cta(2.85)}
  ${hint}${p.sample}
</section>`;
  },

  // C · 문: 이름이 적힌 종이 문이 양쪽으로 열리며 사진이 드러난다
  C: (p) => {
    const face = `<div class="c-face"><p class="c-small">The wedding of</p><p class="c-big">${p.shortNames}</p><p class="c-date">${p.ymd.join(" · ")}</p></div>`;
    return `
<section id="cover" class="cover cv-C" style="--hint-d:3.2s">
  ${p.ph("cover-photo")}
  <div class="cover-shade"></div>
  <div class="c-door c-left" aria-hidden="true">${face}</div>
  <div class="c-door c-right" aria-hidden="true">${face}</div>
  <p ${fu("cover-eyebrow", 2.2)}>Save the date</p>
  <h1 ${fu("cover-names", 2.3)}>${p.names}</h1>
  <p ${fu("cover-when", 2.45)}>${p.when}</p>
  <p ${fu("cover-where", 2.55)}>${p.where}</p>
  ${cta(2.7)}
  ${hint}${p.sample}
</section>`;
  },

  // D · 인화: 즉석 사진 한 장이 내려앉고, 하얗게 바랜 사진이 천천히 현상된다
  D: (p) => `
<section id="cover" class="cover cv-D cover-light" style="--hint-d:3s">
  <div class="d-card">
    ${p.ph("d-photo")}
    <p class="d-caption">${Number(p.ymd[0])}. ${Number(p.ymd[1])}. ${Number(p.ymd[2])}.</p>
  </div>
  <div class="cover-info">
    <p ${fu("cover-eyebrow", 1.9)}>Save the date</p>
    <h1 ${fu("cover-names", 2.0)}>${p.names}</h1>
    <p ${fu("cover-when", 2.15)}>${p.when}</p>
    <p ${fu("cover-where", 2.25)}>${p.where}</p>
    ${cta(2.4, true)}
  </div>
  ${hint}${p.sample}
</section>`,

  // E · 아치: 가는 아치 선이 그려지고, 아치 창 안으로 사진이 아래에서 차오른다
  E: (p) => `
<section id="cover" class="cover cv-E cover-light" style="--hint-d:3s">
  <div class="e-arch">
    <div class="e-line" aria-hidden="true"></div>
    <div class="e-window">${p.ph("e-photo")}</div>
  </div>
  <div class="cover-info">
    <p ${fu("cover-eyebrow", 1.7)}>Wedding Invitation</p>
    <h1 ${fu("cover-names", 1.8)}>${p.names}</h1>
    <p ${fu("cover-when", 1.95)}>${p.when}</p>
    <p ${fu("cover-where", 2.05)}>${p.where}</p>
    ${cta(2.2, true)}
  </div>
  ${hint}${p.sample}
</section>`,

  // F · 글자: 큰 날짜 숫자 속에만 사진이 비치다가, 숫자 안으로 빨려 들어가듯 사진 전체가 열린다
  F: (p) => `
<section id="cover" class="cover cv-F" style="--hint-d:3.2s">
  ${p.ph("cover-photo")}
  <div class="cover-shade"></div>
  <div class="f-type ph-bg${p.emptyCls}" ${p.bgStyle} aria-hidden="true">${p.ymd[1]}.${p.ymd[2]}</div>
  <p ${fu("cover-eyebrow", 2.2)}>Save the date</p>
  <h1 ${fu("cover-names", 2.3)}>${p.names}</h1>
  <p ${fu("cover-when", 2.45)}>${p.when}</p>
  <p ${fu("cover-where", 2.55)}>${p.where}</p>
  ${cta(2.7)}
  ${hint}${p.sample}
</section>`,

  // G · H 손글씨: 사진이 밝아오면 그 위에 사선 손글씨가 획 순서대로 써지고, 다 써지면 이름과 날짜가 떠오른다
  G: (p) => lettered(p, "wedding", "The Wedding"),
  H: (p) => lettered(p, "save", "Save the Date"),
};

function lettered(p, key, label) {
  return `
<section id="cover" class="cover cv-G" style="--hint-d:4.1s">
  ${p.ph("cover-photo")}
  <div class="cover-shade"></div>
  <div class="g-lettering">${renderLettering(key, label, 0.9, 2.6)}</div>
  <h1 ${fu("cover-names", 3.2)}>${p.names}</h1>
  <p ${fu("cover-when", 3.35)}>${p.when}</p>
  <p ${fu("cover-where", 3.45)}>${p.where}</p>
  ${cta(3.6)}
  ${hint}${p.sample}
</section>`;
}

export function renderCover(c, variant = "A") {
  return (VARIANTS[variant] ?? VARIANTS.A)(parts(c));
}

/** 비교용 페이지 왼쪽 위의 시안 이동 표시 (기본 주소에는 없다) */
export function variantNav(current) {
  const keys = Object.keys(COVER_NAMES);
  const i = keys.indexOf(current);
  const prev = keys[(i + keys.length - 1) % keys.length];
  const next = keys[(i + 1) % keys.length];
  return `<nav class="variant-nav" aria-label="대문 시안">
  <a href="../${prev}/" aria-label="이전 시안 ${prev}">‹</a><span>${current} · ${COVER_NAMES[current]}</span><a href="../${next}/" aria-label="다음 시안 ${next}">›</a>
</nav>`;
}

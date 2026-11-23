// config 를 받아 섹션 HTML 을 만든다. 동작(복사·폼·사진 넘기기)은 main.js 와 각 모듈이 붙인다.
import { renderCover } from "./covers.js";
import { daysUntil, formatDateKo, formatShortKo, formatTimeKo, isOpenUntil, monthGrid } from "./dates.js";
import { asset, esc, lines } from "./html.js";

export const head = (eyebrow, title) =>
  `<header class="sec-head"><p class="eyebrow">${eyebrow}</p>${title ? `<h2>${esc(title)}</h2>` : ""}</header>`;

/** 사진 목록을 { src, thumb } (절대 주소) 로 통일. 사진이 없으면 빈 칸(placeholder)을 만든다 */
export function galleryItems(gallery) {
  if (gallery.photos.length) {
    return gallery.photos.map((p) => {
      const { src, thumb = src } = typeof p === "string" ? { src: p } : p;
      return { src: asset(src), thumb: asset(thumb) };
    });
  }
  return Array.from({ length: gallery.placeholderCount }, (_, i) => ({ placeholder: true, hue: (i * 47) % 360 }));
}

export const placeholderStyle = (item) => `background:hsl(${item.hue} 22% 82%)`;

function greeting(c) {
  const family = (p) =>
    p.parents.length
      ? `<p class="family"><span>${p.parents.map(esc).join(" · ")}</span><small>의 ${esc(p.relation)}</small><b>${esc(p.short)}</b></p>`
      : "";
  const { groom, bride } = c.couple;
  const families = family(groom) + family(bride);
  return `
<section id="greeting" class="sec">
  ${head("Invitation", "소중한 분들을 초대합니다")}
  <p class="body-text">${lines(c.greeting.text)}</p>
  ${families ? `<div class="families">${families}</div>` : ""}
</section>`;
}

function rsvp(c, now) {
  const r = c.rsvp;
  const open = isOpenUntil(r.deadline, now);
  const body = open
    ? `<p class="body-text">${lines(r.message)}</p>
  <p class="deadline">${formatShortKo(r.deadline)}까지 받습니다</p>
  <button type="button" class="btn" data-open-rsvp>참석 의사 전달하기</button>`
    : `<p class="body-text">${lines(r.closedMessage)}</p>`;
  return `
<section id="rsvp" class="sec tint">
  ${head("R.S.V.P.", "참석 의사 전달")}
  ${body}
</section>`;
}

function calendar(c, now) {
  const { date, time } = c.wedding;
  const [y, m, d] = date.split("-").map(Number);
  const week = ["일", "월", "화", "수", "목", "금", "토"].map((w, i) => `<span class="wk${i === 0 ? " sun" : ""}">${w}</span>`);
  const cells = monthGrid(y, m)
    .flat()
    .map((n, i) => {
      if (n === null) return "<span></span>";
      const cls = [n === d && "on", i % 7 === 0 && "sun"].filter(Boolean).join(" ");
      return `<span${cls ? ` class="${cls}"` : ""}>${n}</span>`;
    });
  const days = daysUntil(date, now);
  const who = `${esc(c.couple.groom.short)} <i class="heart">♥</i> ${esc(c.couple.bride.short)}`;
  const line =
    days > 0
      ? `${who}의 결혼식이 <b>${days}일</b> 남았습니다.`
      : days === 0
        ? `오늘은 ${who}의 결혼식 날입니다.`
        : `${who}의 결혼식이 <b>${-days}일</b> 지났습니다.`;
  const unit = (key, label) => `<div><b data-unit="${key}">0</b><span>${label}</span></div>`;
  return `
<section id="calendar" class="sec">
  ${head("Wedding Day")}
  <p class="cal-date">${formatDateKo(date)}</p>
  <p class="cal-time">${formatTimeKo(time)}</p>
  <div class="cal">
    <p class="cal-month">${m}월</p>
    <div class="cal-grid">${week.join("")}${cells.join("")}</div>
  </div>
  <div class="countdown" data-countdown>
    ${unit("days", "DAYS")}${unit("hours", "HOUR")}${unit("minutes", "MIN")}${unit("seconds", "SEC")}
  </div>
  <p class="dday-line">${line}</p>
</section>`;
}

function gallery(c) {
  const items = galleryItems(c.gallery);
  const initial = c.gallery.initialCount;
  const tiles = items
    .map((item, i) => {
      const more = i >= initial ? " is-more" : "";
      const inner = item.placeholder
        ? `<span class="tile-ph" style="${placeholderStyle(item)}">${i + 1}</span>`
        : `<img src="${esc(item.thumb)}" alt="" loading="lazy" decoding="async">`;
      return `<button type="button" class="tile${more}" data-index="${i}" aria-label="사진 ${i + 1} 크게 보기">${inner}</button>`;
    })
    .join("");
  return `
<section id="gallery" class="sec">
  ${head("Gallery", "우리의 순간")}
  <div class="gallery">${tiles}</div>
  ${items.length > initial ? `<button type="button" class="btn btn-ghost more" data-more>사진 더보기</button>` : ""}
</section>`;
}

function guide(c) {
  const items = c.guide.items;
  if (!items.length) return "";
  return `
<section id="guide" class="sec">
  ${head("Information", "예식 안내")}
  <div class="accordion">
    ${items.map((it) => `<details><summary>${esc(it.title)}</summary><div class="details-body">${lines(it.body)}</div></details>`).join("")}
  </div>
</section>`;
}

function accounts(c) {
  const a = c.accounts;
  const group = (label, list) => `
    <details class="acc-group">
      <summary>${label}</summary>
      <ul>
        ${list
          .map(
            (x) => `<li>
          <div>
            <p class="acc-who">${esc(x.role)}<b>${esc(x.name)}</b></p>
            <p class="acc-num">${esc(x.bank)} ${esc(x.number)}</p>
          </div>
          <button type="button" class="copy" data-copy="${esc(x.number)}" data-toast="계좌번호를 복사했습니다">복사</button>
        </li>`,
          )
          .join("")}
      </ul>
    </details>`;
  return `
<section id="account" class="sec tint">
  ${head("Account", "마음 전하실 곳")}
  <p class="body-text small">${lines(a.message)}</p>
  <div class="acc">${group("신랑측 계좌번호", a.groom)}${group("신부측 계좌번호", a.bride)}</div>
</section>`;
}

function location(c) {
  const v = c.venue;
  const q = encodeURIComponent(v.mapQuery || v.address);
  return `
<section id="location" class="sec">
  ${head("Location", "오시는 길")}
  ${v.name ? `<p class="venue-name">${esc(v.name)} ${esc(v.hall)}</p>` : ""}
  <div class="addr-row">
    <p class="venue-addr">${esc(v.address)}${v.name ? "" : `, ${esc(v.hall)}`}</p>
    <button type="button" class="copy" data-copy="${esc(v.address)}" data-toast="주소를 복사했습니다">복사</button>
  </div>
  ${v.tel ? `<p class="venue-tel"><a href="tel:${esc(v.tel)}">${esc(v.tel)}</a></p>` : ""}
  <div class="map ph">네이버 지도 자리<br><small>API 키 발급 후 연결</small></div>
  <div class="map-links">
    <a href="https://map.naver.com/p/search/${q}" target="_blank" rel="noopener">네이버 지도</a>
    <a href="https://map.kakao.com/link/search/${q}" target="_blank" rel="noopener">카카오맵</a>
    <a href="tmap://search?name=${q}">티맵</a>
  </div>
  <dl class="directions">
    ${v.directions.map((d) => `<dt>${esc(d.label)}</dt><dd>${lines(d.body)}</dd>`).join("")}
  </dl>
</section>`;
}

function footer(c) {
  return `
<footer class="footer">
  <button type="button" class="btn btn-ghost" data-copy-link>청첩장 링크 복사</button>
  <p class="thanks">Thank you</p>
  <p class="sign">${esc(c.couple.groom.name)} · ${esc(c.couple.bride.name)}</p>
</footer>`;
}

/** 섹션을 따로 골라 쓰는 시안(J안, theme-j.js)을 위한 묶음 */
export const sections = { greeting, rsvp, calendar, gallery, guide, accounts, location, footer };

/** 페이지 전체. 섹션 순서는 여기서 바꾼다. variant 는 대문 시안(A~H). J안은 theme-j.js 의 renderPageJ 가 따로 짠다 */
export function renderPage(c, now = new Date(), variant = "A") {
  return [renderCover(c, variant), greeting(c), rsvp(c, now), calendar(c, now), gallery(c), guide(c), accounts(c), location(c), footer(c)].join("");
}

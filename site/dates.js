// 날짜 계산은 전부 한국 시간(Asia/Seoul) 기준이다.
// 하객 기기의 시간대가 달라도(해외 하객 등) 같은 D-day·마감 판정이 나온다.
// 날짜는 "YYYY-MM-DD", 시각은 "HH:MM" 문자열로 주고받는다.

const WEEKDAYS_KO = ["일", "월", "화", "수", "목", "금", "토"];
const WEEKDAYS_EN = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const DAY_MS = 86_400_000;

function parts(iso) {
  return iso.split("-").map(Number);
}

function dayNumber(iso) {
  const [y, m, d] = parts(iso);
  return Date.UTC(y, m - 1, d) / DAY_MS;
}

/** 요일 번호 (0 = 일요일) */
export function weekday(iso) {
  const [y, m, d] = parts(iso);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** "2027-03-13" → "2027년 3월 13일 토요일" */
export function formatDateKo(iso) {
  const [y, m, d] = parts(iso);
  return `${y}년 ${m}월 ${d}일 ${WEEKDAYS_KO[weekday(iso)]}요일`;
}

/** "2027-02-27" → "2월 27일(토)" */
export function formatShortKo(iso) {
  const [, m, d] = parts(iso);
  return `${m}월 ${d}일(${WEEKDAYS_KO[weekday(iso)]})`;
}

/** "2027-03-13" → "2027. 3. 13. SAT" */
export function formatDotEn(iso) {
  const [y, m, d] = parts(iso);
  return `${y}. ${m}. ${d}. ${WEEKDAYS_EN[weekday(iso)]}`;
}

/** "13:00" → "오후 1시", "11:30" → "오전 11시 30분", "12:00" → "낮 12시" */
export function formatTimeKo(hhmm) {
  const [h, min] = hhmm.split(":").map(Number);
  const hour = h < 12 ? `오전 ${h}시` : h === 12 ? "낮 12시" : `오후 ${h - 12}시`;
  return min ? `${hour} ${min}분` : hour;
}

/** 한국 시간 기준 오늘 날짜 "YYYY-MM-DD" */
export function todayKst(now = new Date()) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" })
      .formatToParts(now)
      .map(({ type, value }) => [type, value]),
  );
  return `${p.year}-${p.month}-${p.day}`;
}

/** 그날까지 남은 날 수. 오늘이면 0, 지났으면 음수 */
export function daysUntil(iso, now = new Date()) {
  return dayNumber(iso) - dayNumber(todayKst(now));
}

/** 124 → "D-124", 0 → "D-DAY", -3 → "D+3" */
export function dDayLabel(days) {
  if (days > 0) return `D-${days}`;
  if (days === 0) return "D-DAY";
  return `D+${-days}`;
}

/** 마감일 당일 밤 12시(한국 시간)까지는 true */
export function isOpenUntil(deadlineIso, now = new Date()) {
  return todayKst(now) <= deadlineIso;
}

/** 예식 시각(한국 시간)의 epoch 밀리초 */
export function weddingInstant(dateIso, hhmm) {
  return Date.parse(`${dateIso}T${hhmm}:00+09:00`);
}

/** 남은 시간을 일·시·분·초로 나눈다. 이미 지났으면 null */
export function countdown(targetMs, nowMs) {
  const diff = targetMs - nowMs;
  if (diff <= 0) return null;
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

/** 그 달의 달력. 한 주에 7칸씩, 빈 칸은 null */
export function monthGrid(year, month) {
  const first = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

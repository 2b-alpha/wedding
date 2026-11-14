import { test } from "node:test";
import assert from "node:assert/strict";
import {
  countdown,
  dDayLabel,
  daysUntil,
  formatDateKo,
  formatDotEn,
  formatShortKo,
  formatTimeKo,
  isOpenUntil,
  monthGrid,
  todayKst,
  weddingInstant,
} from "../site/dates.js";

test("날짜 표기", () => {
  assert.equal(formatDateKo("2027-03-13"), "2027년 3월 13일 토요일");
  assert.equal(formatShortKo("2027-02-27"), "2월 27일(토)");
  assert.equal(formatDotEn("2027-03-13"), "2027. 3. 13. SAT");
});

test("시각 표기", () => {
  assert.equal(formatTimeKo("13:00"), "오후 1시");
  assert.equal(formatTimeKo("11:30"), "오전 11시 30분");
  assert.equal(formatTimeKo("12:00"), "낮 12시");
  assert.equal(formatTimeKo("12:30"), "낮 12시 30분");
});

test("오늘 날짜는 기기 시간대가 아니라 한국 시간 기준", () => {
  // UTC 3월 12일 15:30 = 한국 3월 13일 00:30
  assert.equal(todayKst(new Date("2027-03-12T15:30:00Z")), "2027-03-13");
  assert.equal(todayKst(new Date("2027-03-12T14:59:59Z")), "2027-03-12");
});

test("D-day", () => {
  assert.equal(daysUntil("2027-03-13", new Date("2026-11-14T03:00:00Z")), 119);
  assert.equal(daysUntil("2027-03-13", new Date("2027-03-12T15:00:00Z")), 0);
  assert.equal(daysUntil("2027-03-13", new Date("2027-03-15T03:00:00Z")), -2);
  assert.equal(dDayLabel(119), "D-119");
  assert.equal(dDayLabel(0), "D-DAY");
  assert.equal(dDayLabel(-2), "D+2");
});

test("참석 의사는 마감일 밤 12시(한국 시간)에 닫힌다", () => {
  assert.equal(isOpenUntil("2027-02-27", new Date("2027-02-27T14:59:59Z")), true); // 한국 23:59:59
  assert.equal(isOpenUntil("2027-02-27", new Date("2027-02-27T15:00:00Z")), false); // 한국 28일 00:00
});

test("카운트다운", () => {
  const target = weddingInstant("2027-03-13", "13:00");
  assert.equal(target, Date.parse("2027-03-13T04:00:00Z"));
  assert.deepEqual(countdown(target, target - (2 * 86400 + 3 * 3600 + 4 * 60 + 5) * 1000), {
    days: 2,
    hours: 3,
    minutes: 4,
    seconds: 5,
  });
  assert.equal(countdown(target, target), null);
});

test("2027년 3월 달력은 월요일에 시작해 31일까지", () => {
  const weeks = monthGrid(2027, 3);
  assert.deepEqual(weeks[0], [null, 1, 2, 3, 4, 5, 6]);
  assert.equal(weeks.length, 5);
  assert.deepEqual(weeks.at(-1), [28, 29, 30, 31, null, null, null]);
  assert.ok(weeks.every((w) => w.length === 7));
});

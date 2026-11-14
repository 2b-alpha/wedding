// HTML 문자열을 만들 때 쓰는 작은 도구

export const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export const lines = (s) => esc(s).replace(/\n/g, "<br>");

/** site/ 기준 경로(config 에 적는 사진 경로)를 절대 주소로. 비교용 하위 폴더(/A/ 등)에서 열어도 사진이 깨지지 않는다 */
export const asset = (path) => new URL(path, import.meta.url).href;

#!/bin/sh
# 대문 시안 비교용 페이지 site/A ~ site/H 를 site/index.html 에서 만든다. index.html 을 고쳤으면 다시 돌린다.
# 시안이 하나로 정해지면 이 스크립트와 site/[A-H] 폴더를 지운다.
set -e
cd "$(dirname "$0")/../site"
for v in A B C D E F G H; do
  mkdir -p "$v"
  sed -e "s#<html lang=\"ko\">#<html lang=\"ko\" data-variant=\"$v\">#" \
      -e "s#<title>#<title>${v}안 · #" \
      -e 's#href="styles.css"#href="../styles.css"#' \
      -e 's#href="covers.css"#href="../covers.css"#' \
      -e 's#src="main.js"#src="../main.js"#' \
      index.html > "$v/index.html"
done

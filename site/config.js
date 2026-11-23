// 청첩장에 들어가는 내용은 전부 이 파일에서 고친다. 화면 코드(sections.js 등)는 건드리지 않아도 된다.
// "TODO" 주석이 붙은 값은 아직 받지 못한 내용이라 임시로 채워 둔 것이다.
// 제목·공유 미리보기 문구는 카톡이 스크립트를 읽지 않아서 index.html <head> 에 따로 적혀 있다. 이름·날짜가 바뀌면 거기도 고친다.

export default {
  couple: {
    // TODO 신랑/신부 확인 — 받은 순서(김성준, 권주영)대로 신랑·신부로 가정
    groom: {
      name: "김성준",
      short: "성준",
      parents: ["○○○", "○○○"], // TODO 아버지, 어머니. 혼주 이름을 넣지 않으려면 [] 로 비운다
      relation: "아들", // 장남·차남 등
    },
    bride: {
      name: "권주영",
      short: "주영",
      parents: ["○○○", "○○○"], // TODO
      relation: "딸",
    },
  },

  wedding: {
    date: "2027-03-13",
    time: "13:00", // TODO 시간 미정 — 확정되면 여기만 고친다
  },

  venue: {
    name: "", // TODO 예식장 이름. 비어 있으면 주소를 대신 보여 준다
    hall: "5층",
    address: "서울 마포구 양화로 130",
    tel: "", // TODO 예식장 전화번호 (선택)
    mapQuery: "", // 지도 앱에서 검색할 말. 비우면 주소로 검색한다. 예식장 이름이 정해지면 그 이름이 더 정확하다
    directions: [
      { label: "지하철", body: "가까운 역과 출구 안내 (준비 중)" }, // TODO
      { label: "버스", body: "정류장과 노선 안내 (준비 중)" }, // TODO
      { label: "주차", body: "주차 가능 위치와 무료 주차 시간 (준비 중)" }, // TODO
    ],
  },

  cover: {
    // TODO 대문 사진. 지금은 시안 비교용 임시 사진(Unsplash 무료 사진)이다. 받으면 경로를 바꾸고 sampleLabel 을 지운다
    photo: "photos/cover-sample.jpg", // 세로 사진 (예: "photos/cover.jpg")
    sampleLabel: "임시 사진", // 대문 오른쪽 위에 붙는 표시. 진짜 사진을 넣으면 "" 로
  },

  greeting: {
    // TODO 예시 문구
    text: "봄이 시작되는 3월,\n두 사람이 같은 길을 걷기 시작합니다.\n\n귀한 걸음으로 함께해 주시면\n더없는 기쁨으로 간직하겠습니다.",
  },

  rsvp: {
    deadline: "2027-02-27", // TODO 이날 밤 12시(한국 시간)까지 받고 자동으로 닫힌다
    endpoint: "", // TODO 응답을 받을 주소(구글 스프레드시트 연결 후). 비어 있으면 미리보기라 저장하지 않는다
    askPhone: false, // TODO 연락처를 받을지
    maxCompanions: 5, // 동반 인원(본인 제외) 선택지 상한
    message:
      "저희 결혼식은 지정석으로 준비하고 있습니다.\n오시는 분들을 한 분 한 분 정성껏 모실 수 있도록\n참석 여부를 알려 주시면 감사하겠습니다.",
    closedMessage:
      "참석 의사 접수가 마감되었습니다.\n참석을 원하시면 신랑·신부에게 직접 연락 부탁드립니다.",
  },

  gallery: {
    // TODO 사진 20~30장. "photos/01.jpg" 처럼 경로만 적거나, 썸네일을 따로 두면 { src, thumb } 로 적는다
    photos: [],
    placeholderCount: 24, // photos 가 비어 있을 때 보여 줄 빈 칸 수
    initialCount: 9, // 처음에 보여 줄 장수. 나머지는 "사진 더보기" 로 펼친다
  },

  guide: {
    // 예식 순서·안내사항 (선택). 섹션을 빼려면 items 를 [] 로 비운다
    items: [
      { title: "예식 순서", body: "예식 순서를 안내합니다. (준비 중)" }, // TODO
      { title: "식사 안내", body: "식사 장소와 시간을 안내합니다. (준비 중)" }, // TODO
      { title: "화환 안내", body: "화환 관련 안내입니다. (준비 중)" }, // TODO
    ],
  },

  program: [
    // TODO 예식 순서 예시 — J안에서 타임라인으로 보여 준다. 빼려면 [] 로 비운다
    // icon: door(맞이) · rings(예식) · camera(사진) · meal(식사) · toast(축배)
    { time: "12:30", title: "하객 맞이", icon: "door" },
    { time: "13:00", title: "예식", icon: "rings" },
    { time: "13:40", title: "사진 촬영", icon: "camera" },
    { time: "14:00", title: "식사", icon: "meal" },
  ],

  accounts: {
    message: "참석이 어려워 직접 축하를 전하지 못하는 분들을 위해\n계좌번호를 기재하였습니다. 너그러운 마음으로 양해 부탁드립니다.",
    // TODO 은행·계좌번호·예금주
    groom: [
      { role: "신랑", name: "김성준", bank: "○○은행", number: "000-0000-0000" },
      { role: "아버지", name: "○○○", bank: "○○은행", number: "000-0000-0000" },
      { role: "어머니", name: "○○○", bank: "○○은행", number: "000-0000-0000" },
    ],
    bride: [
      { role: "신부", name: "권주영", bank: "○○은행", number: "000-0000-0000" },
      { role: "아버지", name: "○○○", bank: "○○은행", number: "000-0000-0000" },
      { role: "어머니", name: "○○○", bank: "○○은행", number: "000-0000-0000" },
    ],
  },
};

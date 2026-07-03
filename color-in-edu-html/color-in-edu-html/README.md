# 컬러인에듀센터 랜딩페이지 (순수 HTML 버전)

퍼스널컬러 진단 · 색채심리 · 개인 컨설팅 · 기업/공공기관 출강, 4개 서비스를 소개하고
신청을 받는 원페이지 랜딩페이지입니다. 빌드 과정 없는 순수 HTML/CSS/JS로 제작했고,
신청 데이터는 Google Sheets에 저장됩니다.

## 로컬에서 확인하기

별도 설치 없이 `index.html`을 브라우저로 열면 바로 확인됩니다.
(폼 전송을 테스트하려면 아래 Google Sheets 연동을 먼저 설정하세요.)

VS Code를 쓰신다면 Live Server 확장으로 열어도 됩니다.

## Google Sheets 연동 설정 (신청 데이터 저장)

`google-apps-script/README.md` 안내를 따라 Google Apps Script 웹앱을 배포하고,
발급받은 URL을 `js/main.js` 파일 상단의 `WEBHOOK_URL`에 붙여넣으세요.

```js
const WEBHOOK_URL = "https://script.google.com/macros/s/여기에_배포된_ID/exec";
```

## GitHub → Vercel 배포하기

### 1. GitHub에 올리기
```bash
git init
git add .
git commit -m "컬러인에듀센터 랜딩페이지 (HTML 버전)"
git branch -M main
git remote add origin https://github.com/<본인계정>/color-in-edu.git
git push -u origin main
```
(GitHub에서 새 저장소를 먼저 만든 뒤 remote 주소를 본인 저장소 주소로 바꿔주세요.)

### 2. Vercel에 연결
1. https://vercel.com 에서 `Add New → Project`
2. 방금 만든 GitHub 저장소 선택 → Import
3. Framework Preset은 `Other`로 두면 됩니다. (정적 파일이라 별도 빌드 명령 불필요)
4. `Deploy` 클릭 → 몇 분 뒤 `*.vercel.app` 주소로 접속 가능

> Google Sheets 연동 URL은 `js/main.js`에 이미 들어있는 방식이라, Vercel 환경변수 설정은
> 필요 없습니다. 단, `WEBHOOK_URL`을 코드에 넣기 전에 GitHub에 먼저 push하지 않도록
> 주의하세요 (배포 전에 값을 채워서 커밋하면 됩니다).

### 3. 커스텀 도메인 연결 (선택)
Vercel 프로젝트 → Settings → Domains 에서 보유하신 도메인을 연결할 수 있습니다.

## 프로젝트 구조

```
index.html              # 랜딩페이지 전체 (히어로, 4개 서비스 섹션, 신청폼, 푸터)
css/style.css            # 컬러/폰트 디자인 토큰 + 반응형 스타일
js/main.js                # 서비스 선택 동기화 + 신청폼 제출 로직
google-apps-script/       # Google Sheets 연동 스크립트 + 설치 가이드
```

## 콘텐츠 수정하기

- **서비스 소개 문구, 대상/방식 정보**: `index.html`의 각 `<section class="service">` 블록을 수정하세요.
- **연락처, 주소, 인스타그램/카카오 링크**: `index.html` 하단 `<footer>` 부분과 헤더의 링크를 수정하세요.
- **강조 색상(4계절 컬러)**: `css/style.css` 최상단 `:root` 안의
  `--spring / --summer / --autumn / --winter` 값을 바꿔주세요.
- **서비스 이름, CTA 문구**: `js/main.js` 상단 `SERVICES` 객체를 수정하세요.

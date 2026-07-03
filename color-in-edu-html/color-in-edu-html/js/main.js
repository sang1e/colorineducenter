// ------------------------------------------------------------------
// 설정: Google Apps Script 웹앱 URL을 여기에 붙여넣으세요.
// (google-apps-script/README.md 참고)
// ------------------------------------------------------------------
const WEBHOOK_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";

const SERVICES = {
  personal: { title: "퍼스널컬러 진단", accentVar: "--spring", cta: "퍼스널컬러 진단 접수하기" },
  psychology: { title: "색채심리 프로그램", accentVar: "--summer", cta: "색채심리 프로그램 접수하기" },
  consulting: { title: "개인 컨설팅", accentVar: "--autumn", cta: "개인 컨설팅 접수하기" },
  corporate: { title: "기업 · 공공기관 출강", accentVar: "--winter", cta: "출강 문의 접수하기" },
};

let selected = "personal";

const applyCard = document.getElementById("applyCard");
const pillRow = document.getElementById("pillRow");
const selectedServiceLabel = document.getElementById("selectedServiceLabel");
const submitLabel = document.getElementById("submitLabel");
const applyForm = document.getElementById("applyForm");
const applySuccess = document.getElementById("applySuccess");
const formError = document.getElementById("formError");
const submitBtn = document.getElementById("submitBtn");

function selectService(id, { scroll = false } = {}) {
  if (!SERVICES[id]) return;
  selected = id;
  const accentVarValue = `var(${SERVICES[id].accentVar})`;

  applyCard.style.setProperty("--accent", accentVarValue);
  selectedServiceLabel.textContent = SERVICES[id].title;
  submitLabel.textContent = SERVICES[id].cta;

  pillRow.querySelectorAll(".pill").forEach((pill) => {
    pill.classList.toggle("active", pill.dataset.service === id);
  });

  if (scroll) {
    document.getElementById("apply").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// 히어로 스와치 + 서비스 섹션 CTA 버튼
document.querySelectorAll(".js-pick").forEach((btn) => {
  btn.addEventListener("click", () => {
    selectService(btn.dataset.service, { scroll: true });
  });
});

// 헤더의 "신청하기" 버튼
document.querySelector(".js-apply").addEventListener("click", () => {
  selectService(selected, { scroll: true });
});

// 신청폼 안의 서비스 선택 필
pillRow.querySelectorAll(".js-pill").forEach((pill) => {
  pill.addEventListener("click", () => selectService(pill.dataset.service));
});

// 초기 상태
selectService(selected);

// ------------------------------------------------------------------
// 폼 제출
// ------------------------------------------------------------------
applyForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  formError.hidden = true;

  const fd = new FormData(applyForm);
  const payload = {
    service: SERVICES[selected].title,
    name: (fd.get("name") || "").toString().trim(),
    phone: (fd.get("phone") || "").toString().trim(),
    preferredDate: (fd.get("preferredDate") || "").toString().trim(),
    message: (fd.get("message") || "").toString().trim(),
    consent: fd.get("consent") === "on",
  };

  if (!payload.name || !payload.phone || !payload.consent) {
    formError.textContent = "이름, 연락처, 개인정보 수집 동의는 필수예요.";
    formError.hidden = false;
    return;
  }

  if (WEBHOOK_URL.includes("YOUR_DEPLOYMENT_ID")) {
    formError.textContent = "아직 Google Sheets 연동 URL이 설정되지 않았어요. js/main.js의 WEBHOOK_URL을 확인해주세요.";
    formError.hidden = false;
    return;
  }

  submitBtn.disabled = true;
  const originalLabel = submitLabel.textContent;
  submitLabel.textContent = "전송 중...";

  try {
    // Apps Script 웹앱은 브라우저 CORS 프리플라이트를 지원하지 않으므로
    // text/plain 으로 보내 프리플라이트를 피하고 no-cors 모드로 전송합니다.
    // (응답 본문은 읽을 수 없지만 요청은 정상적으로 시트에 기록됩니다.)
    await fetch(WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });

    applyForm.hidden = true;
    applySuccess.hidden = false;
  } catch (err) {
    formError.textContent = "전송 중 문제가 발생했어요. 카카오톡 상담으로도 문의해주세요.";
    formError.hidden = false;
  } finally {
    submitBtn.disabled = false;
    submitLabel.textContent = originalLabel;
  }
});

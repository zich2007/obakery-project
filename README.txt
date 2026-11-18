O.BAKERY PROJECT 6.0 — Gemini AI 사진 분석 버전
기반: O.BAKERY PROJECT 5.22 무료 OCR 개선 버전

추가된 기능
- Gemini AI 재료표 사진 분석
- Gemini AI 제조공정 사진 분석
- 구조화된 JSON 결과를 화면에서 직접 수정
- 검토 후 승인한 항목만 기존 배합표/공정 기록에 반영
- API Key는 Vercel 서버 환경변수에만 저장
- 무료 우선 모델 gemini-3.5-flash-lite만 허용 (서버에서 다른 모델명 차단)
- 기존 OCR, 수동 입력, PPTX/PDF, .obakery 저장/불러오기 기능 유지

중요: 이 ZIP만 GitHub Pages에 올리면 AI 분석은 작동하지 않습니다.
GitHub Pages는 정적 호스팅이므로 /api/analyze 서버 기능을 Vercel에 별도로 배포해야 합니다.

배포 방법
1. 이 ZIP을 압축 해제합니다.
2. GitHub 저장소의 index.html을 이 버전의 index.html로 교체하고 커밋합니다.
3. 같은 프로젝트 파일 전체(api 폴더, package.json, vercel.json 포함)를 Vercel에 새 프로젝트로 가져옵니다.
4. Vercel 프로젝트 Settings > Environment Variables에 다음 값을 추가합니다.
   GEMINI_API_KEY = Google AI Studio에서 발급한 API Key
   GEMINI_MODEL = gemini-3.5-flash-lite
ALLOWED_ORIGIN = https://zich2007.github.io
5. Vercel에 배포합니다.
6. 배포된 Vercel 프로젝트의 Settings > Domains에서 기본 도메인을 확인합니다.
7. GitHub Pages와 같은 도메인에서 /api/analyze를 호출하도록 연결해야 합니다.
   가장 쉬운 방법은 GitHub Pages 대신 Vercel이 정적 페이지와 API를 함께 제공하도록 프로젝트를 배포하는 것입니다.
   또는 사용자 도메인을 사용하는 경우 해당 도메인을 Vercel에 연결하고 GitHub Pages 연결을 대체하세요.
8. AI Studio에서 무료 등급/사용 가능 모델과 한도를 확인한 뒤 테스트합니다.

API 주소 관련 주의
- 프런트엔드는 기본값으로 /api/analyze를 호출합니다. GitHub Pages를 유지할 경우 AI 서버 주소 입력란에 Vercel API URL을 저장합니다.
- API는 ALLOWED_ORIGIN에 지정한 단일 웹사이트 Origin만 허용합니다. 실제 배포 주소와 정확히 일치시켜야 합니다.
- Vercel과 GitHub Pages는 별도로 배포할 수 있습니다. 기존 GitHub Pages 주소를 계속 사용할 수 있습니다.

무료 및 개인정보 안내
- 기본 모델은 gemini-3.5-flash-lite이며 현재 공식 가격표에서 무료 등급 입력/출력이 무료로 표시됩니다. 무료 한도와 모델 제공 여부는 Google 정책에 따라 달라질 수 있습니다.
- 무료 등급은 제출한 콘텐츠가 Google 제품 개선에 사용될 수 있습니다. 따라서 사진 전송 전에 동의를 받도록 UI에 안내를 넣었습니다.
- 무료 한도 초과 시 유료 모델로 자동 전환하지 않습니다.
- API Key를 index.html, GitHub 저장소, .obakery 파일에 입력하지 마세요.
- API에는 공개 사용자 인증/영구 일일 쿼터가 아직 없습니다. 공개 배포 전에 접근 제한 또는 별도 rate limit 저장소를 추가하는 것이 안전합니다.

사진 처리 제한
- 최대 4장/회, JPG/PNG/WEBP
- 원본 사진 한 장당 최대 25MB, 분석 전 브라우저에서 JPEG로 압축
- 압축된 이미지 한 장당 서버 전송 데이터 750KB 이하, 최대 4장/회
- HEIC는 JPG로 변환 후 사용

검증 상태
- 이 패키지는 소스/구조 및 JavaScript 문법 확인 단계입니다.
- 실제 Gemini 분석은 사용자의 API Key와 Vercel 배포가 완료되어야 테스트할 수 있습니다.
- iPad Safari 실기기 테스트, PPTX/PDF 회귀 테스트는 아직 완료되지 않았습니다.

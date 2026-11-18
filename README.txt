O.BAKERY PROJECT 5.7
=====================

변경 사항
1. PPTX 라이브러리 로딩 개선
   - 기존 jsDelivr 단일 CDN 로딩을 제거했습니다.
   - PPT 내보내기를 누르면 jsDelivr와 unpkg 브라우저 번들을 순서대로 시도합니다.
   - 라이브러리 로드가 끝난 후 PPT 생성이 시작됩니다.

2. PDF 내보내기 추가
   - 'PDF 파일 만들기'를 누르면 인쇄용 보고서가 새 창으로 열립니다.
   - 브라우저 인쇄 화면에서 'PDF로 저장' 또는 '파일에 저장'을 선택하면 됩니다.
   - iPad Safari에서는 공유/인쇄 메뉴에서 PDF 저장을 선택하세요.
   - PDF는 브라우저의 인쇄 기능을 사용하므로 별도 PDF API 키나 서버가 필요하지 않습니다.

3. 임시 저장 기능 제거
   - '작성 내용 임시 저장' 버튼 제거
   - 브라우저 localStorage 임시 저장 및 자동 복원 코드 제거
   - '프로젝트 .obakery 저장' 및 '프로젝트 불러오기'는 유지됩니다.

배포 방법
- 기존 GitHub 저장소 루트의 index.html을 이 패키지의 index.html로 교체하세요.
- GitHub Pages 배포가 완료된 뒤 Safari/Chrome에서 사이트를 새로고침하세요.

검증
- JavaScript 문법 검사 통과
- HTML 중복 ID 검사 통과
- 임시 저장 버튼 및 localStorage 참조 제거 확인
- 실제 PPTX CDN 로드 및 iPad PDF 인쇄는 사용자 브라우저에서 최종 확인이 필요합니다.

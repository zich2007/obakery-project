O.BAKERY PROJECT 5.19
PDF Invalid margin array 오류 수정

오류 원인:
5.18 PDF 생성 옵션에서 margin 배열을 전달하는 과정이 현재 로드된 html2pdf.js/jsPDF 조합에서
'Invalid margin array' 예외를 발생시키는 것으로 확인했습니다.

수정:
- PDF margin 옵션을 배열 대신 단일 숫자 12로 변경
- 상하좌우 여백을 12mm로 통일
- 그 외 PDF 생성 안정화, CDN 재시도, 이미지/폰트 로딩 대기 기능은 5.18 설정 유지

설치:
1. ZIP 압축을 풉니다.
2. index.html을 GitHub 저장소 루트의 기존 index.html과 교체합니다.
3. 커밋 후 사이트를 새로고침하고 PDF를 다시 생성합니다.

검증:
JavaScript 문법 검사 통과. 실제 브라우저 PDF 다운로드 성공 여부는 별도 테스트가 필요합니다.

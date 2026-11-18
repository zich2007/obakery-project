O.BAKERY PROJECT 5.0

실행 방법
1. index.html을 Chrome 또는 Edge에서 엽니다.
2. 인터넷 연결이 있으면 PPTX 및 프로젝트 ZIP 라이브러리가 로드됩니다.
3. 사진 자동 분류는 AI 서버 주소를 설정하면 해당 서버로 이미지 데이터와 분류 항목을 JSON POST합니다.
   요청 형식: { images: [{index,name,data}], categories: [..] }
   응답 형식: { results: [{index,category,confidence,reason}] } 또는 결과 배열 자체
4. AI 서버 주소가 비어 있으면 파일명 기반 추천만 수행합니다. 이는 실제 이미지 AI 분석이 아닙니다.
5. 프로젝트 저장은 .obakery ZIP 패키지를 기기에 다운로드합니다. 불러오기로 복원할 수 있습니다.
6. 브라우저 임시 저장은 편의 기능이며, 장기 보관은 .obakery 파일로 백업하세요.

개인정보 및 데이터
- 프로젝트는 기본적으로 브라우저에서 처리됩니다.
- AI 서버 주소를 입력하고 분류를 실행하면 이미지가 해당 서버로 전송됩니다.
- API 키를 HTML에 직접 넣지 마세요. 인증은 서버 측에서 처리하세요.
- CDN 라이브러리 로딩과 실제 AI 서버 호출에는 인터넷이 필요합니다.

기반: O.BAKERY PROJECT 4.2
추가: 통합 사진 업로드, 분류 검토 UI, PPT 공정별 이미지 그룹 배치, .obakery 저장/불러오기

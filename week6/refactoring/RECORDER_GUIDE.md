# Chrome DevTools Recorder 사용 가이드

## 1. Recorder로 테스트 시나리오 녹화하기

### 단계별 진행 방법:

1. **Chrome 브라우저에서 개발자 도구 열기**

   - `F12` 또는 `Ctrl+Shift+I` (Windows) / `Cmd+Opt+I` (Mac)

2. **Recorder 탭 찾기**

   - 개발자 도구에서 "Recorder" 탭 클릭
   - 없다면 `>>` 버튼 클릭 후 "Recorder" 선택

3. **새 녹화 시작**

   - "Start recording" 버튼 클릭
   - 녹화 이름: "UserProfile_E2E_Test" 입력

4. **테스트 시나리오 수행**

   - `http://localhost:3000/week6` 페이지로 이동
   - "수정하기" 버튼 클릭
   - 사용자 이름 필드에 "테스트사용자" 입력
   - 이메일 필드에 "test@example.com" 입력
   - "저장하기" 버튼 클릭
   - 성공 메시지 확인

5. **녹화 중지 및 저장**
   - "Stop recording" 버튼 클릭
   - 우상단 "Export" 버튼 클릭
   - "Export as a JSON file" 선택
   - 파일명: `user-profile-e2e-test.json`으로 저장

## 2. 생성된 JSON 파일 확인

생성된 JSON 파일은 다음과 같은 구조를 가집니다:

```json
{
  "title": "UserProfile_E2E_Test",
  "steps": [
    {
      "type": "navigate",
      "url": "http://localhost:3000/week6"
    },
    {
      "type": "click",
      "target": "main",
      "selectors": [["button:has-text('수정하기')"]],
      "offsetX": 50,
      "offsetY": 20
    }
    // ... 추가 스텝들
  ]
}
```

## 3. 과제 제출 파일

- `user-profile-e2e-test.json`: 녹화된 테스트 시나리오
- 이 파일을 과제와 함께 제출하세요.

## 4. 참고사항

- 녹화 전에 반드시 개발 서버(`pnpm dev`)가 실행 중이어야 합니다.
- 브라우저의 화면 크기나 요소 위치에 따라 선택자가 달라질 수 있습니다.
- 녹화 중 불필요한 클릭이나 움직임은 피해주세요.

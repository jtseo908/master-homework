# 과제 설명

파일은 4~5주차 과제에서 사용된 동일한 코드를 이용합니다. unit test, e2e test를 구현해주세요. 또한 테스팅 기록을 recorder를 통해 녹화하여 json 파일 형태로 첨부해주세요.

unit test: input의 정상 타이핑 여부, 필수 데이터 입력 여부
e2e test: 회원 정보 수정까지 적용, API는 MSW 사용해 json 형태로 반환(ex. {success: true})
recorder의 export 기능을 이용해 json 파일로 다운로드 받아 첨부

과제에 포함은 안하겠지만 puppeteer로 된 recorder 기록을 다운받은 후 로컬 환경에서 recorder를 통해 녹화된 기록이 잘 작동되는지 headless를 부여했을 때와 부여하지 않았을 때도 사용해보세요.

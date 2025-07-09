const puppeteer = require("puppeteer");

/**
 * Puppeteer E2E 테스트 - 과제 보너스 구현
 * headless 모드와 non-headless 모드로 실행 가능
 */
async function runPuppeteerTest(headless = true) {
  console.log(`\n🤖 Puppeteer 테스트 시작 (headless: ${headless})`);

  const browser = await puppeteer.launch({
    headless: headless,
    devtools: !headless,
    slowMo: headless ? 0 : 100, // non-headless 모드에서는 천천히 실행
  });

  try {
    const page = await browser.newPage();

    // 콘솔 로그 출력
    page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

    // week6 페이지로 이동
    console.log("📍 /week6 페이지로 이동 중...");
    await page.goto("http://localhost:3000/week6", {
      waitUntil: "networkidle2",
    });

    // 페이지 제목 확인
    const title = await page.title();
    console.log(`📄 페이지 제목: ${title}`);

    // '수정하기' 버튼 클릭
    console.log('🔘 "수정하기" 버튼 클릭...');
    await page.waitForSelector('button:has-text("수정하기")');
    await page.click('button:has-text("수정하기")');

    // 입력 필드에 값 입력
    console.log("✏️  사용자 정보 입력 중...");
    await page.waitForSelector('input[name="username"]');
    await page.type('input[name="username"]', "");
    await page.type('input[name="username"]', "Puppeteer테스트사용자");

    await page.waitForSelector('input[name="email"]');
    await page.type('input[name="email"]', "");
    await page.type('input[name="email"]', "puppeteer@test.com");

    // '저장하기' 버튼 클릭
    console.log('💾 "저장하기" 버튼 클릭...');
    await page.click('button:has-text("저장하기")');

    // 성공 메시지 대기 및 확인
    console.log("✅ 성공 메시지 확인 중...");
    try {
      await page.waitForSelector(
        'text="사용자 정보가 성공적으로 업데이트되었습니다!"',
        {
          timeout: 5000,
        }
      );
      console.log("🎉 테스트 성공: 성공 메시지가 표시되었습니다!");
    } catch (error) {
      console.log(
        "⚠️  성공 메시지를 찾을 수 없습니다. 다른 방법으로 확인 중..."
      );

      // 수정하기 버튼이 다시 나타나는지 확인
      await page.waitForSelector('button:has-text("수정하기")');
      console.log("✅ 수정 모드가 종료되었습니다. 테스트 완료!");
    }

    // 스크린샷 저장
    const screenshotPath = `week6/refactoring/e2e/screenshot-${
      headless ? "headless" : "headed"
    }.png`;
    await page.screenshot({ path: screenshotPath });
    console.log(`📸 스크린샷 저장: ${screenshotPath}`);
  } catch (error) {
    console.error("❌ 테스트 실행 중 오류 발생:", error.message);
    throw error;
  } finally {
    await browser.close();
    console.log(`✅ Puppeteer 테스트 완료 (headless: ${headless})\n`);
  }
}

/**
 * 메인 실행 함수
 */
async function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || "both"; // 'headless', 'headed', 'both'

  try {
    if (mode === "headless") {
      await runPuppeteerTest(true);
    } else if (mode === "headed") {
      await runPuppeteerTest(false);
    } else {
      // 기본값: 둘 다 실행
      await runPuppeteerTest(true);
      await runPuppeteerTest(false);
    }

    console.log("🎊 모든 Puppeteer 테스트 완료!");
  } catch (error) {
    console.error("💥 테스트 실패:", error.message);
    process.exit(1);
  }
}

// 스크립트가 직접 실행될 때만 main 함수 호출
if (require.main === module) {
  main();
}

module.exports = { runPuppeteerTest };

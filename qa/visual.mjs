import { chromium } from "playwright";

async function inspectLayout(panel, page) {
  return panel.evaluate((element) => {
    const root = element.shadowRoot;
    const overflow = element.scrollWidth > element.clientWidth;
    const clipped = [...(root?.querySelectorAll("*") ?? [])]
      .filter((child) => {
        const rect = child.getBoundingClientRect();
        const style = getComputedStyle(child);
        return (
          style.display !== "none" &&
          rect.width > 0 &&
          (rect.left < -1 || rect.right > window.innerWidth + 1)
        );
      })
      .map((child) => child.className || child.tagName)
      .slice(0, 5);
    const wrappedControls = [
      ...(root?.querySelectorAll(
        "ha-button, ha-icon-button, .tabs > button, .filters button, .about-actions a",
      ) ?? []),
    ].filter((control) => {
      const style = getComputedStyle(control);
      return control.scrollHeight > parseFloat(style.lineHeight || "0") * 2.2;
    });
    return { overflow, clipped, wrappedControls: wrappedControls.length };
  });
}

const browser = await chromium.launch();
const widths = [320, 375, 414, 768, 1440, 1920];
for (const width of widths) {
 for (const dark of [false, true]) {
  const page = await browser.newPage({
    viewport: { width, height: width < 768 ? 844 : 1000 },
  });
  await page.goto(`http://127.0.0.1:4173/qa/panel.html${dark ? "?dark" : ""}`);
  await page.waitForSelector("haos-ai-panel");
  await page.waitForTimeout(200);

  const panel = page.locator("haos-ai-panel");
  await panel.locator(".suggestion-row").first().click();
  await page.waitForTimeout(100);

  const result = await inspectLayout(panel, page);
  if (result.overflow || result.clipped.length || result.wrappedControls) {
    throw new Error(`Layout failed at ${width}px: ${JSON.stringify(result)}`);
  }
  if ((width === 320 || width === 1440) && !dark) {
    await page.screenshot({
      path: `/tmp/haos-ai-${width}px-detail.png`,
      fullPage: true,
    });
  }


  await panel.locator('.tabs button').nth(3).click();
  await page.waitForTimeout(80);
  const settingsResult = await inspectLayout(panel, page);
  if (settingsResult.overflow || settingsResult.clipped.length || settingsResult.wrappedControls) {
    throw new Error(`Settings layout failed at ${width}px: ${JSON.stringify(settingsResult)}`);
  }
  if ((width === 320 || width === 1440) && !dark) {
    await page.screenshot({ path: `/tmp/haos-ai-settings-${width}px.png`, fullPage: true });
  }

  if (width === 1440) {
    await panel.locator('.tabs button').nth(2).click();
    await page.waitForTimeout(80);
    await panel.locator('.receipt-row').first().click();
    await page.waitForTimeout(80);
    if (!dark) await page.screenshot({ path: "/tmp/haos-ai-activity.png", fullPage: true });
    await panel.locator('.tabs button').nth(1).click();
    await page.waitForTimeout(80);
    if (!dark) await page.screenshot({ path: "/tmp/haos-ai-chat.png", fullPage: true });
    await panel.locator('.tabs button').nth(3).click();
    await page.waitForTimeout(80);
    await page.screenshot({ path: `/tmp/haos-ai-settings-${dark ? "dark" : "light"}.png`, fullPage: true });
  }
  await page.close();
 }
}
await browser.close();
console.log(`Visual QA OK at ${widths.join(", ")}px`);

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

/**
 * Assert that every rendered icon button carries a slotted, visible icon.
 *
 * `ha-icon-button` has no `icon` property, so a button built with the removed
 * `icon="mdi:..."` attribute renders with no glyph at all. This runs in a real
 * browser, which is the only place that can catch it.
 */
async function inspectIconButtons(panel, where) {
  const result = await panel.evaluate((element) => {
    const buttons = [
      ...(element.shadowRoot?.querySelectorAll("ha-icon-button") ?? []),
    ];
    const problems = [];
    for (const button of buttons) {
      // Skip controls the current view hides; a hidden button is not a defect.
      const rect = button.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      const label = button.getAttribute("label") ?? "(unlabelled)";
      if (button.hasAttribute("icon")) {
        problems.push(`${label}: uses the removed icon attribute`);
        continue;
      }
      const icon = button.querySelector("ha-icon[icon]");
      if (!icon) {
        problems.push(`${label}: no slotted ha-icon`);
        continue;
      }
      const iconRect = icon.getBoundingClientRect();
      if (iconRect.width < 8 || iconRect.height < 8) {
        problems.push(
          `${label}: slotted icon is not rendered (${iconRect.width}x${iconRect.height})`,
        );
      }
    }
    return { count: buttons.length, problems };
  });
  if (result.problems.length) {
    throw new Error(`Icon buttons failed in ${where}: ${JSON.stringify(result.problems)}`);
  }
  return result.count;
}

// A cached browser revision can differ from the one this Playwright build
// expects, and the browser cache is not always writable. Point
// HAOS_AI_CHROMIUM at an existing binary to run the checks with that one.
const executablePath = process.env.HAOS_AI_CHROMIUM;
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const widths = [320, 375, 414, 768, 1440, 1920];
let checkedIconButtons = 0;
for (const width of widths) {
 for (const dark of [false, true]) {
  const page = await browser.newPage({
    viewport: { width, height: width < 768 ? 844 : 1000 },
  });
  await page.goto(`http://127.0.0.1:4173/qa/panel.html${dark ? "?dark" : ""}`);
  await page.waitForSelector("haos-ai-panel");
  await page.waitForTimeout(200);

  const panel = page.locator("haos-ai-panel");
  checkedIconButtons += await inspectIconButtons(panel, `inbox ${width}px`);
  await panel.locator(".suggestion-row").first().click();
  await page.waitForTimeout(100);
  checkedIconButtons += await inspectIconButtons(panel, `detail ${width}px`);

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
  checkedIconButtons += await inspectIconButtons(panel, `settings ${width}px`);
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
    checkedIconButtons += await inspectIconButtons(panel, "activity 1440px");
    await panel.locator('.receipt-row').first().click();
    await page.waitForTimeout(80);
    if (!dark) await page.screenshot({ path: "/tmp/haos-ai-activity.png", fullPage: true });
    await panel.locator('.tabs button').nth(1).click();
    await page.waitForTimeout(80);
    checkedIconButtons += await inspectIconButtons(panel, "chat 1440px");
    if (!dark) await page.screenshot({ path: "/tmp/haos-ai-chat.png", fullPage: true });
    await panel.locator('.tabs button').nth(3).click();
    await page.waitForTimeout(80);
    await page.screenshot({ path: `/tmp/haos-ai-settings-${dark ? "dark" : "light"}.png`, fullPage: true });
  }
  await page.close();
 }
}
await browser.close();
console.log(
  `Visual QA OK at ${widths.join(", ")}px (${checkedIconButtons} icon buttons checked)`,
);

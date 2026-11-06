const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const server = require("http").createServer((req, res) => {
    const name = req.url === "/" ? "index.html" : req.url.slice(1);
    const file = path.resolve(__dirname, "..", name);
    if (!file.startsWith(path.resolve(__dirname, "..") + "/")) {
      res.writeHead(403);
      return res.end();
    }
    require("fs").readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end();
      }
      res.setHeader(
        "Content-Type",
        name.endsWith(".css")
          ? "text/css"
          : name.endsWith(".js")
            ? "text/javascript"
            : "text/html",
      );
      res.end(data);
    });
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:" + server.address().port);
  const click = async (name) =>
    page.getByRole("button", { name, exact: true }).click();
  const assert = async (text) => {
    if (!(await page.getByText(text, { exact: false }).first().isVisible()))
      throw Error("Missing " + text);
  };
  await page.screenshot({ path: "/tmp/navigate-home.png", fullPage: true });
  await click("Search classroom, building or location...");
  await page.getByRole("textbox").fill("UX design");
  await assert("Room A105");
  await page.locator('[data-place="a105"]').last().click();
  await assert("Get Directions");
  await click("Get Directions");
  await click("View Route");
  await click("Start Navigation");
  for (let i = 0; i < 2; i++) await click("Next instruction");
  await click("Enter building");
  await click("Second Floor");
  await assert("Second floor");
  await click("Ground Floor");
  for (let i = 0; i < 3; i++) await click("Next instruction");
  await click("Finish journey");
  await assert("You found your way.");
  await click("Profile");
  await page.getByLabel("Avoid stairs", { exact: true }).check();
  if (
    (await page.getByLabel("Preferred travel mode").inputValue()) !== "stepfree"
  )
    throw Error("Mode not updated");
  await page.getByLabel("High contrast", { exact: true }).check();
  await page.getByLabel("Larger text", { exact: true }).check();
  if (!(await page.locator("body.large.contrast").count()))
    throw Error("Display settings failed");
  await click("Home");
  await page.locator('[data-place="newman"]').click();
  await click("Get Directions");
  if (
    (await page
      .getByRole("radio", { name: /Step-free/ })
      .getAttribute("aria-checked")) !== "true"
  )
    throw Error("Preferred mode lost");
  await click("View Route");
  await click("Route Details");
  await assert("lift");
  await click("Start Navigation");
  for (let i = 0; i < 3; i++) await click("Next instruction");
  await click("Enter building");
  await assert("Stairs · excluded");
  for (let i = 0; i < 4; i++) await click("Next instruction");
  await click("Finish journey");
  await click("Home");
  await page.locator('[data-place="science"]').click();
  await click("Get Directions");
  await page.getByRole("radio", { name: /Cycling/ }).click();
  await click("View Route");
  await assert("5 min");
  await click("Start Navigation");
  await click("Next instruction");
  await assert("Park your bicycle");
  await click("Next instruction");
  await click("Next instruction");
  await click("Enter building");
  await assert("Indoor walking route");
  await click("Explore");
  await click("Bicycle parking");
  await page.locator('[data-place="parking"]').click();
  await assert("Science bicycle parking");
  await click("Get Directions");
  await click("View Route");
  await click("Start Navigation");
  for (let i = 0; i < 3; i++) await click("Next instruction");
  await click("Finish journey");
  await click("Saved");
  await page
    .getByRole("button", { name: "Remove Room A105 from saved", exact: true })
    .click();
  await click("Home");
  await click("Search classroom, building or location...");
  await page.getByRole("textbox").fill("a105");
  await page.locator('#results [data-place="a105"]').click();
  await click("Save destination");
  await click("Saved");
  await assert("Room A105");
  await page.reload();
  await click("Saved");
  await assert("Room A105");
  await click("Profile");
  await page.getByLabel("High contrast", { exact: true }).uncheck();
  await page.getByLabel("Larger text", { exact: true }).uncheck();
  await click("Home");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  );
  if (overflow) throw Error("Horizontal overflow");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: "/tmp/navigate-desktop.png", fullPage: true });
  if (errors.length) throw Error(errors.join("\n"));
  console.log(
    "PASS: walking, step-free, cycling, parking, floor selection, saved persistence, settings, mobile layout; no JavaScript errors.",
  );
  await browser.close();
  server.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

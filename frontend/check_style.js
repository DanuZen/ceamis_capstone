const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/#fitur', { waitUntil: 'networkidle2' });
  await page.setViewport({ width: 390, height: 844 });
  
  const titleStyle = await page.evaluate(() => {
    const title = document.querySelector('.landing-feature-card__title');
    if (!title) return null;
    const style = window.getComputedStyle(title);
    return {
      text: title.textContent,
      display: style.display,
      visibility: style.visibility,
      opacity: style.opacity,
      color: style.color,
      fontSize: style.fontSize,
      height: style.height,
      width: style.width,
      fontFamily: style.fontFamily
    };
  });
  
  console.log(JSON.stringify(titleStyle, null, 2));
  await browser.close();
})();

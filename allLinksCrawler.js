const puppeteer = require('puppeteer');
const fs = require('fs');

const startUrl = 'https://www.example.com/';

async function main() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    const visitedUrls = new Set();
    const links = [];
  
    async function visit(url) {
      
        if (visitedUrls.has(url) || url.includes('#content')) {
        return;
      } else if (!url.includes(startUrl)){
        visitedUrls.add(url);
        return;
      } 
      console.log('Visiting: ' + url);
      visitedUrls.add(url);
      await page.goto(url);
  
      const pageLinks = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a[href]'), a => a.href);
      });
      
      const filtrado = pageLinks.filter(element => element.includes(startUrl));

      links.push(...filtrado);
      console.log('Quantidade de links: ' + links.length);
      for (const link of filtrado) {
        await visit(link);
      }
    }
  
    await visit(startUrl);
  
    const uniqueLinks = [...new Set(links)];
  
    fs.writeFileSync('links.txt', uniqueLinks.join('\n'));
  
    await browser.close();

  }
  
  main();
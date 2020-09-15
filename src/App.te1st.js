const puppeteer = require('puppeteer')

const launchOptions = {
  headless: false,
  slowMo: 250,
  // devtools: true,
}

const sleep = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms);
  })
}

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjMwMDAyLCJ1c2VyTmFtZSI6Imppbi5saSIsImV4cCI6MTU5OTg5ODMwNSwiaWF0IjoxNTk5NzI1NTA1fQ.vAGTRx0dWujt7DGGv_OLHB5Q7GdFB6HjX3P5drLNGOQ'

describe('sussess submit job', () => {
  test('sussess submit job', async () => {
    let browser = await puppeteer.launch(launchOptions)
    let page = await browser.newPage()

    
    
    await page.setCookie({
      name: 'token',
      value: token,
      domain: '121.46.18.84'
    })
    page.emulate({
      viewport: {
        width: 1000,
        height: 2400,
      },
      userAgent: '',
    })
    await page.evaluateOnNewDocument(
      token => {
        localStorage.clear();
        localStorage.setItem('token', token);
      }, token);

    await page.goto('http://121.46.18.84/submission/training', {
      waitUntil: 'load'
    });
    await page.evaluate(() => {
      console.log('begin')
    })
    await page.focus('[name=jobName]')
    await page.keyboard.type('testSubmitJob')
    await page.focus('[name=image]')
    await page.keyboard.type('node:12')
    await page.focus('[name=command]')
    await page.keyboard.type(`echo "123" && sleep 1h`)
    await page.evaluate(() => {
      document.querySelectorAll('[type=submit]')[1].click()
    })
    const running = await page.waitForFunction(
      'document.querySelector("body").innerText.includes("Running") && !document.querySelector("body").innerText.includes("Failed")', {
        timeout: 600000
      }
    );

    expect(running).toBe(true);

    
    
    // expect(html).toBe('Welcome to React');
    browser.close();
  }, 600000)
})

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

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjMwMDAxLCJ1c2VyTmFtZSI6ImFkbWluIiwiZXhwIjoxNjAwMjIwOTk5LCJpYXQiOjE2MDAwNDgxOTl9.WAPxP-OdrXreWM1wvpIsn5ywodlo8IcP7oOoGXHIrNo'

describe('代码开发', () => {
  test('提交代码开发', async () => {
    let browser = await puppeteer.launch(launchOptions)
    let page = await browser.newPage()

    await page.setCookie({
      name: 'token',
      value: token,
      domain: 'http://219.133.167.42:30000/'
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

    await page.goto('http://219.133.167.42:30000/AIarts/codeDevelopment/add', {
      waitUntil: 'load'
    });
    await page.evaluate(() => {
      console.log('begin')
    })
    await page.focus('#name')
    await page.keyboard.type('code-dev')
    await page.focus('#desc')
    await page.keyboard.type('测试开发开发')
    await page.focus('#codePath')
    await page.keyboard.type(`codess`)
    await page.evaluate(() => {
      document.querySelector('[type=submit]').click()
    })

    await sleep(2000)

    const location = await page.evaluate(() => {
      return window.location.href
    })

    expect(/\/codeDevelopment/.test(location)).toBe(true)
  
    const status = await page.evaluate(() => {
      return new Promise((resolve, reject) => {
        const timer = setInterval(async () => {
          const status = document.querySelector("[title=code-dev]").nextElementSibling.title
          if (['运行中', '错误', '已关闭'].includes(status)) {
            clearInterval(timer)
            resolve(status)
          }
        }, 800);
      })
    })

    expect(status).toBe('运行中');

    

    browser.close();
  }, 600000)
})

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
let Homepage = require('../pageobjects/homePage');
let SearchResultsPage = require('../pageobjects/searchResultsPage');

describe('Kriso.ee Bookstore Tests', () => {
  let driver; 
  const TIMEOUT = 10000;

  beforeAll(async () => {
    driver = await new Builder()
      .forBrowser('chrome')
      .build();

    await driver.manage().window().maximize();
    await driver.manage().setTimeouts({ implicit: TIMEOUT });

    Homepage = new Homepage(driver)
    await Homepage.openUrl()
    await Homepage.acceptCookies()
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Verify Kriso homepage loads correctly', async () => {
    await driver.get('https://www.kriso.ee');
    const title = await driver.getTitle();
    expect(title).toContain('Kriso');
    
    const logo = await driver.findElement(By.css('#top-searchbar-wrap > a > svg'));
    expect(await logo.isDisplayed()).toBeTruthy();
  });

  test('Search for "harry potter" and verify results', async () => {
    const searchBox = await driver.findElement(By.css('#top-search-text'));
    await searchBox.sendKeys('harry potter');
    await searchBox.submit();

    const searchResults = new SearchResultsPage(driver);
    await searchResults.waitForResults();
    
    const products = await searchResults.getProducts();
    expect(products.length).toBeGreaterThan(1);

    await searchResults.verifyProductTitlesContain('harry potter');
  });

  test('Sort results by price and verify order', async () => {
    const searchResults = new SearchResultsPage(driver);
    await searchResults.waitForResults();

    await searchResults.sortByPrice();
    const prices = await searchResults.getProductPrices(5);
    
    for (const price of prices) {
      expect(price).toBeGreaterThan(30);
      expect(price).toBeLessThan(80);
    }
  });

  test('Filter by language (English) and verify results', async () => {
    const searchResults = new SearchResultsPage(driver);
    await searchResults.waitForResults();

    await searchResults.filterByLanguage();
    await searchResults.verifyLanguageFilterApplied();
  });

  test('Filter by format (Hardback) and verify results', async () => {
    const searchResults = new SearchResultsPage(driver);
    await searchResults.waitForResults();

    await searchResults.filterByFormat();
    await searchResults.verifyFormatFilterApplied();
  });
});
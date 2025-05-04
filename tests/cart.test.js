const { Builder } = require("selenium-webdriver");
let Homepage = require("../pageobjects/homePage");
let Cartpage = require("../pageobjects/homePage");
const firefox = require("selenium-webdriver/firefox");

let driver;
const TIMEOUT = 10000;
let cartSumOfOne = 0;
let cartSumOfTwo = 0;

describe("Shopping cart workflow", () => {
  beforeAll(async () => {
    driver = await new Builder()
      .forBrowser("firefox")
      .setFirefoxOptions(new firefox.Options().addArguments("--headless"))
      .build();
    await driver.manage().window().maximize();
    await driver.manage().setTimeouts({ implicit: TIMEOUT });

    Homepage = new Homepage(driver);
    await Homepage.openUrl();
    await Homepage.acceptCookies();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test("Test logo element is visible", async () => {
    await Homepage.verifyLogo();
  });

  test("Test add first item to shopping cart", async () => {
    await Homepage.openBookPage(1);
    await Homepage.addItemToShoppingCart();
    await Homepage.verifyItemAddedToCart();
  });

  test("Test continue shopping", async () => {
    await Homepage.continueShopping();
  });

  test("Test add second item to shopping cart", async () => {
    await Homepage.openBookPage(2);
    await Homepage.addItemToShoppingCart();
    await Homepage.verifyItemAddedToCart();
  });

  test("Test verify cart has two items", async () => {
    Cartpage = await Homepage.openShoppingCart();
    await Cartpage.verifyCartQuantity(2);
  });

  test("Test verify cart has correct sum of two", async () => {
    cartSumOfTwo = await Cartpage.verifyCartSumIsCorrect();
  });

  test("Test remove one item from the shopping cart", async () => {
    await Cartpage.removeItemFromCart(1);
    await Cartpage.verifyCartQuantity(1);
  });

  test("Test verify cart has correct sum of one", async () => {
    cartSumOfOne = await Cartpage.verifyCartSumIsCorrect();
    expect(cartSumOfOne).toBeLessThan(cartSumOfTwo);
  });
});
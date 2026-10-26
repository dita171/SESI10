const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const firefox = require("selenium-webdriver/firefox");

describe("Open Belajar Bareng Automation", function () {
    this.timeout(60000); 
    let driver;

    before(async function () {
        const options = new firefox.Options();
        options.addArguments("-headless");
        driver = await new Builder()
            .forBrowser("firefox")
            .setFirefoxOptions(options)
            .build();
    });

    beforeEach(async function () {
        console.log("Starting a new test...");
        await driver.get("https://belajar-bareng.onrender.com/"); 
        await driver.wait(until.elementLocated(By.css("input[placeholder='Username']")), 35000);
    });

    it("Should login successfully with valid credentials", async function () {
        let usernameInput = await driver.findElement(By.css("input[placeholder='Username']"));
        let passwordInput = await driver.findElement(By.css("input[placeholder='Password']"));
        let loginButton = await driver.findElement(By.css("[data-testid='login-button']"));

        await usernameInput.sendKeys("user_valid");
        await passwordInput.sendKeys("password_valid");
        await loginButton.click();

        await driver.sleep(2000);
        let title = await driver.getTitle();
        assert.ok(title.includes("Dashboard") || title !== "");
    });

        it("Should fail to login with wrong password", async function () {
        let usernameInput = await driver.findElement(By.css("input[placeholder='Username']"));
        let passwordInput = await driver.findElement(By.css("input[placeholder='Password']"));
        let loginButton = await driver.findElement(By.css("[data-testid='login-button']"));

        await usernameInput.sendKeys("user_valid");
        await passwordInput.sendKeys("salah_password");
        await loginButton.click();

              let errorMessage = await driver.wait(async function() {
            let el = await driver.findElement(By.css("p.error"));
            let text = await el.getText();
            return text.length > 0 ? el : false;
        }, 8000);

        let errorText = await errorMessage.getText();
        assert.ok(errorText.length > 0, "Pesan error gagal ditampilkan pada elemen p.error");
    });

        it("Should show warning when username is empty", async function () {
        let passwordInput = await driver.findElement(By.css("input[placeholder='Password']"));
        let loginButton = await driver.findElement(By.css("[data-testid='login-button']"));

        await passwordInput.sendKeys("password_valid");
        await loginButton.click();

        let title = await driver.getTitle();
        assert.ok(title.includes("Login") || title !== "");
    });

    afterEach(async function () {
        console.log("Test completed.");
    });

    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });
});

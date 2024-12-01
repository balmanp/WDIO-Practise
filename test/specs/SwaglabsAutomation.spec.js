const readExcelData = require('./utils/readUser.js');

describe("Suite Swaglabs Automation", () => {
    let data;

    before(async () => {
        const filePath = './data/user.xlsx';
        const sheetName = 'Sheet1';
        data = readExcelData(filePath, sheetName);
        await browser.maximizeWindow();
        await browser.url("https://www.saucedemo.com/v1/");
        await expect(browser).toHaveUrl("https://www.saucedemo.com/v1/");
    });

    async function login(user, password) {
        const userInput = await browser.$("aria/Username");
        const passwordInput = await browser.$("aria/Password");
        const loginButton = await browser.$("#login-button");

        await userInput.setValue(user);
        await passwordInput.setValue(password);
        await loginButton.click();

        const currentUrl = await browser.getUrl();
        if (currentUrl.includes("index.html")) {
            const errorMessage = await browser.$(".error-message-container");
            if (await errorMessage.isDisplayed()) {
                console.log(`Login gagal untuk user: ${user}`);
            }
            return false;
        }

        const inventoryPageElement = await browser.$(".inventory_list");
        return await inventoryPageElement.isDisplayed();
    }

    async function checkout() {
        const addToCartButtons = [
            '//*[@id="inventory_container"]/div/div[4]/div[3]/button',
            '//*[@id="inventory_container"]/div/div[5]/div[3]/button',
            '//*[@id="inventory_container"]/div/div[1]/div[3]/button'
        ];
        for (const button of addToCartButtons) {
            await browser.$(button).click();
        }

        await browser.$("aria/3").click();
        await expect(browser).toHaveUrl("https://www.saucedemo.com/v1/cart.html");
        await browser.$("aria/CHECKOUT").click();
        await expect(browser).toHaveUrl("https://www.saucedemo.com/v1/checkout-step-one.html");
    }

    async function checkoutData(firstName, lastName, postalCode) {
        const firstNameInput = await browser.$("aria/First Name");
        const lastNameInput = await browser.$("aria/Last Name");
        const postalCodeInput = await browser.$("aria/Zip/Postal Code");

        await firstNameInput.setValue(firstName);
        await lastNameInput.setValue(lastName);
        await postalCodeInput.setValue(postalCode);

        await browser.$('input[type="submit"][value="CONTINUE"]').click();
        await expect(browser).toHaveUrl("https://www.saucedemo.com/v1/checkout-step-two.html");

        await browser.$("aria/FINISH").click();
        await expect(browser).toHaveUrl("https://www.saucedemo.com/v1/checkout-complete.html");
    }

    async function logout() {
        const menuButton = await browser.$('aria/Open Menu');
        await menuButton.click();
        const logoutButton = await browser.$('aria/Logout');
        await logoutButton.click();
        console.log("User telah logout.");
    }

    it("Automation login dan proses checkout untuk setiap user", async () => {
        for (const row of data) {
            console.log(`Menguji user: ${row.user}`);

            const loginSuccessful = await login(row.user, row.password);
            if (!loginSuccessful) {
                continue;
            }

            console.log(`Login berhasil untuk user: ${row.user}`);

            await checkout();
            await checkoutData(row.firstName, row.lastName, row.postalCode);

            console.log("Proses checkout selesai.");
            await logout();
        }
    });
});

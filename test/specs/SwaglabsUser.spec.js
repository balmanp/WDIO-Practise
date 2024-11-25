const readExcelData = require('../specs/utils/readUser.js');

describe("Swaglabs Test Suite", () => {
    let data;

    // Memuat data dari file Excel dan membuka aplikasi sebelum pengujian
    before(async () => {
        const filePath = './data/user.xlsx';
        const sheetName = 'Sheet1';
        data = readExcelData(filePath, sheetName);
        await browser.maximizeWindow();
        await browser.url("https://www.saucedemo.com/v1/");
        await expect(browser).toHaveUrl("https://www.saucedemo.com/v1/");
    });

    // Fungsi untuk login ke aplikasi
    async function login(user, password) {
        const userInput = await browser.$("aria/Username");
        const passwordInput = await browser.$("aria/Password");
        const loginButton = await browser.$("#login-button");

        await userInput.setValue(user);
        await passwordInput.setValue(password);
        await loginButton.click();

        // Memeriksa apakah login berhasil atau gagal
        const currentUrl = await browser.getUrl();
        if (currentUrl.includes("index.html")) {
            const errorMessage = await browser.$(".error-message-container");
            const isErrorDisplayed = await errorMessage.isDisplayed();
            if (isErrorDisplayed) {
                const errorText = await errorMessage.getText();
                console.log(`Login gagal untuk user: ${user} - Error: ${errorText}`);
            } else {
                console.error("Redirect tidak terduga ke index.html tanpa pesan error.");
            }
            return false;
        }

        // Verifikasi halaman inventori ditampilkan setelah login
        const inventoryPageElement = await browser.$(".inventory_list");
        if (!await inventoryPageElement.isDisplayed()) {
            console.error("Login gagal: Halaman inventori tidak ditampilkan.");
            return false;
        }
        return true;
    }

    // Fungsi untuk melakukan proses checkout
    async function checkout() {
        // Menambahkan item ke keranjang belanja
        const addToCartButtons = [
            '//*[@id="inventory_container"]/div/div[4]/div[3]/button',
            '//*[@id="inventory_container"]/div/div[5]/div[3]/button',
            '//*[@id="inventory_container"]/div/div[1]/div[3]/button'
        ];
        for (const button of addToCartButtons) {
            await browser.$(button).click();
        }

        // Navigasi ke keranjang dan melanjutkan ke checkout
        await browser.$("aria/3").click();
        await expect(browser).toHaveUrl("https://www.saucedemo.com/v1/cart.html");
        await browser.$("aria/CHECKOUT").click();
        await expect(browser).toHaveUrl("https://www.saucedemo.com/v1/checkout-step-one.html");

        // Mengisi informasi checkout
        const checkoutData = {
            firstName: "User101",
            lastName: "Jdid",
            postalCode: "123456"
        };

        await browser.$("aria/First Name").setValue(checkoutData.firstName);
        await browser.$("aria/Last Name").setValue(checkoutData.lastName);
        await browser.$("aria/Zip/Postal Code").setValue(checkoutData.postalCode);

        // Melanjutkan ke langkah berikutnya dalam proses checkout
        await browser.$('input[type="submit"][value="CONTINUE"]').click();
        await expect(browser).toHaveUrl("https://www.saucedemo.com/v1/checkout-step-two.html");

        // Menyelesaikan pembelian
        await browser.$("aria/FINISH").click();
        await expect(browser).toHaveUrl("https://www.saucedemo.com/v1/checkout-complete.html");
    }

    // Fungsi untuk logout dari aplikasi
    async function logout() {
        const menuButton = await browser.$('aria/Open Menu');
        await menuButton.click();
        const logoutButton = await browser.$('aria/Logout');
        await logoutButton.click();
        console.log("User telah logout.");
    }

    // Pengujian untuk menangani login dan proses checkout
    it("Menangani login dan proses checkout untuk setiap user", async () => {
        for (const row of data) {
            console.log(`Menguji user: ${row.user}`);
            
            const loginSuccessful = await login(row.user, row.password);
            if (!loginSuccessful) {
                continue; // Abaikan user ini jika gagal login
            }

            console.log(`Login berhasil untuk user: ${row.user}`);
            
            await checkout();
            console.log("Proses checkout selesai.");

            await logout();
        }
    });
});

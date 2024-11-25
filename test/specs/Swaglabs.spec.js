describe("Swaglabs Test Suite", () => {
  it("Alur pembelian lengkap di Swaglabs", async () => {
    // Memaksimalkan jendela browser dan membuka URL
    await browser.maximizeWindow();
    await browser.url("https://www.saucedemo.com/v1/");

    // Login ke aplikasi
    await browser.$("aria/Username").setValue("standard_user");
    await browser.$("aria/Password").setValue("secret_sauce");
    await browser.$("#login-button").click();

    // Verifikasi login berhasil
    await expect(browser).toHaveUrl("https://www.saucedemo.com/v1/inventory.html");

    // Menambahkan item ke keranjang
    const addToCartButtons = [
      '//*[@id="inventory_container"]/div/div[4]/div[3]/button',
      '//*[@id="inventory_container"]/div/div[5]/div[3]/button',
      '//*[@id="inventory_container"]/div/div[1]/div[3]/button'
    ];
    for (const button of addToCartButtons) {
      await browser.$(button).click();
    }

    // Menuju ke keranjang dan verifikasi URL
    await browser.$("aria/3").click();
    await expect(browser).toHaveUrl("https://www.saucedemo.com/v1/cart.html");

    // Melanjutkan ke checkout
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

    // Melanjutkan proses checkout
    await browser.$('input[type="submit"][value="CONTINUE"]').click();
    await expect(browser).toHaveUrl("https://www.saucedemo.com/v1/checkout-step-two.html");

    // Menyelesaikan pembelian
    await browser.$("aria/FINISH").click();
    await expect(browser).toHaveUrl("https://www.saucedemo.com/v1/checkout-complete.html");
  });
});

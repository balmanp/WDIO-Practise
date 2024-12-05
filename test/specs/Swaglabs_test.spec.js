describe("Swaglabs_test", () => {
  it("tests Swaglabs_test", async () => {
    await browser.maximizeWindow();
    await browser.url("https://www.saucedemo.com/v1/");
    await browser.performActions([{
      type: 'key',
      id: 'keyboard',
      actions: [{ type: 'keyUp', value: '' }]
    }])
    await browser.$("aria/Username").click()
    await browser.$("aria/Username").setValue("standard_user")
    await browser.$("aria/Password").click()
    await browser.$("aria/Password").setValue("secret_sauce")
    await browser.$("#login-button").click()
    await expect(browser).toHaveUrl("https://www.saucedemo.com/v1/inventory.html")
    await browser.$("//*[@id=\"inventory_container\"]/div/div[4]/div[3]/button").click()
    await browser.$("//*[@id=\"inventory_container\"]/div/div[5]/div[3]/button").click()
    await browser.$("//*[@id=\"inventory_container\"]/div/div[1]/div[3]/button").click()
    await browser.$("aria/3").click()
    await expect(browser).toHaveUrl("https://www.saucedemo.com/v1/cart.html")
    await browser.$("aria/CHECKOUT").click()
    await expect(browser).toHaveUrl("https://www.saucedemo.com/v1/checkout-step-one.html")
    await browser.$("aria/First Name").click()
    await browser.$("aria/First Name").setValue("U")
    await browser.$("aria/First Name").setValue("User101")
    await browser.performActions([{
      type: 'key',
      id: 'keyboard',
      actions: [{ type: 'keyDown', value: '' }]
    }])
    await browser.performActions([{
      type: 'key',
      id: 'keyboard',
      actions: [{ type: 'keyUp', value: '' }]
    }])
    await browser.$("aria/Last Name").setValue("J")
    await browser.$("aria/Last Name").setValue("Jdid")
    await browser.performActions([{
      type: 'key',
      id: 'keyboard',
      actions: [{ type: 'keyDown', value: '' }]
    }])
    await browser.performActions([{
      type: 'key',
      id: 'keyboard',
      actions: [{ type: 'keyUp', value: '' }]
    }])
    await browser.$("aria/Zip/Postal Code").setValue("123456")
    await browser.$('input[type="submit"][value="CONTINUE"]').click()
    await expect(browser).toHaveUrl("https://www.saucedemo.com/v1/checkout-step-two.html")
    await browser.$("aria/FINISH").click()
    await expect(browser).toHaveUrl("https://www.saucedemo.com/v2/checkout-complete.html")
  });
});

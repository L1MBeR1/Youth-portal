package org.example.site;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import java.time.Duration;

public class LoginTest {
    public static MainPage mainPage;
    public static LoginPage loginPage;
    public static RegPage regPage;
    public static WebDriver driver;

    /**
     * осуществление первоначальной настройки
     */
    @BeforeClass
    public static void setup() {
         //создание экземпляра драйвера
        driver = new ChromeDriver();
        mainPage = new MainPage(driver);
        loginPage = new LoginPage(driver);
        regPage = new RegPage(driver);
        //окно разворачивается на полный экран
        driver.manage().window().maximize();
        //задержка на выполнение теста = 10 сек.
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        //получение ссылки на страницу входа из файла настроек
        driver.get(ConfProperties.getProperty("mainpage")); }
    /**
     * тестовый метод для осуществления аутентификации
     */
    @Test
    public void loginTest() {
        try {
        mainPage.clickLoginBtn();
        loginPage.inputLogin(ConfProperties.getProperty("login"));
        //вводим пароль
        loginPage.inputPasswd(ConfProperties.getProperty("password"));

        Thread.sleep(2000);

        //нажимаем кнопку входа
        //loginPage.clickLoginBtn();

        loginPage.clickRegBtn();
            Thread.sleep(2000);

        regPage.inputEmail(ConfProperties.getProperty("email"));

        regPage.inputPassword(ConfProperties.getProperty("password"));

        regPage.inputConfPassword(ConfProperties.getProperty("password"));

        Thread.sleep(2000);

        //regPage.clickRegBtn();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
         }
    /**
     * осуществление выхода из аккаунта с последующим закрытием окна браузера
     */
    @AfterClass
    public static void tearDown() {
        driver.quit();
        } }
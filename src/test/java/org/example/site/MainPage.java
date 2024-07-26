package org.example.site;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
public class MainPage {
    /**
     * конструктор класса, занимающийся инициализацией полей класса
     */
    public WebDriver driver;
    public MainPage(WebDriver driver) {
        PageFactory.initElements(driver, this);
        this.driver = driver; }

    /**
     * определение локатора кнопки входа в аккаунт
     */
    @FindBy(xpath = "//a[normalize-space()='']//button[@type='button']")
    private WebElement loginBtn;
    /**
     * определение локатора кнопки регистрации
     */


    public void clickLoginBtn() {
        loginBtn.click(); }

}


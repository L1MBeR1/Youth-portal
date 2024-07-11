package org.example;
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
    @FindBy(xpath = "//*[@id=\"root\"]/div/header/nav/div/ul/li[1]")
    private WebElement loginBtn;
    /**
     * определение локатора кнопки регистрации
     */
    @FindBy(xpath = "//*[@id=\"root\"]/div/header/nav/div/ul/li[2]/a")
    private WebElement regBtn;

    public void clickLoginBtn() {
        loginBtn.click(); }

    public void clickRegBtn() {
        regBtn.click(); } }
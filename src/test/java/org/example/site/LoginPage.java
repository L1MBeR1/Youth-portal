package org.example.site;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
public class LoginPage {
    /**
     * конструктор класса, занимающийся инициализацией полей класса
     */
    public WebDriver driver;
    public LoginPage(WebDriver driver) {
        PageFactory.initElements(driver, this);
        this.driver = driver; }
    /**
     * определение локатора поля ввода логина
     */
    @FindBy(xpath = "/html/body/div[1]/div/main/div/div/form/div/div[2]/div/input")
    private WebElement loginField;
    /**
     * определение локатора кнопки входа в аккаунт
     */
    @FindBy(xpath = "/html/body/div[1]/div/main/div/div/form/div/button")
    private WebElement loginBtn;
    /**
     * определение локатора поля ввода пароля
     */
    @FindBy(xpath = "/html/body/div[1]/div/main/div/div/form/div/div[3]/div[1]/input")
    private WebElement passwdField;

    @FindBy(xpath = "//*[@id=\"root\"]/div/header/div/a/div")
    private WebElement logoBtn;

    @FindBy(xpath = "/html/body/div[1]/div/main/div/div/form/div/div[4]/a")
    private WebElement regBtn;

    public void inputLogin(String login) {
        loginField.sendKeys(login); }
    /**
     * метод для ввода пароля
     */
    public void inputPasswd(String passwd) {
        passwdField.sendKeys(passwd); }
    /**
     * метод для осуществления нажатия кнопки входа в аккаунт
     */
    public void clickLoginBtn() {
        loginBtn.click(); }

    public void clickLogoBtn() {
        logoBtn.click(); }

    public void clickRegBtn() {
        regBtn.click(); }
}
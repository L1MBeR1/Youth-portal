package org.example.site;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
public class RegPage {
    /**
     * конструктор класса, занимающийся инициализацией полей класса
     */
    public WebDriver driver;

    public RegPage(WebDriver driver) {
        PageFactory.initElements(driver, this);
        this.driver = driver;
    }


    @FindBy(xpath = "/html/body/div[1]/div/main/div/div/form/div/div[2]/div[1]/input")
    private WebElement emailField;

    @FindBy(xpath = "/html/body/div[1]/div/main/div/div/form/div/div[3]/div[1]/div[1]/div[1]/input")
    private WebElement passwordField;

    @FindBy(xpath = "/html/body/div[1]/div/main/div/div/form/div/div[4]/div[1]/input")
    private WebElement confpasswordField;

    @FindBy(xpath = "/html/body/div[1]/div/main/div/div/form/div/button")
    private WebElement regBtn;

    @FindBy(xpath = "/html/body/div[1]/div/header/div/div[2]/a/button")
    private WebElement loginBtn;


    public void inputEmail(String email) {
        emailField.sendKeys(email);
    }

    public void inputPassword(String password) {
        passwordField.sendKeys(password);
    }

    public void inputConfPassword(String confpassword) {
        confpasswordField.sendKeys(confpassword);
    }

    public void clickRegBtn() {
        regBtn.click();
    }

    public void clickLoginBtn() {
        loginBtn.click();
    }

}
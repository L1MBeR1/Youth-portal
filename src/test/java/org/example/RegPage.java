package org.example;
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

    /**
     * определение локатора меню пользователя
     */
    @FindBy(id= "surname")
    private WebElement surnameField;

    @FindBy(id = "name")
    private WebElement nameField;

    @FindBy(id = "patronymic")
    private WebElement patronymicField;

    @FindBy(id = "birthdate")
    private WebElement birthdateField;

    @FindBy(id = "login")
    private WebElement loginField;

    @FindBy(id = "email")
    private WebElement emailField;

    @FindBy(id = "password")
    private WebElement passwordField;

    @FindBy(xpath = "/html/body/div[1]/div/main/div/div/form/div/div[9]/button")
    private WebElement regBtn;

    @FindBy(xpath = "/html/body/div[1]/div/main/div/div/form/div/div[10]/div/div[2]/a")
    private WebElement loginBtn;

    public void inputSurname(String surname) {
        surnameField.sendKeys(surname);
    }

    public void inputName(String name) {
        nameField.sendKeys(name);
    }

    public void inputPatronymic(String patronymic) {
        patronymicField.sendKeys(patronymic);
    }

    public void inputBirthdate(String birthdate) {
        birthdateField.sendKeys(birthdate);
    }

    public void inputLogin(String login) {
        loginField.sendKeys(login);
    }

    public void inputEmail(String email) {
        emailField.sendKeys(email);
    }

    public void inputPassword(String password) {
        passwordField.sendKeys(password);
    }

    public void clickRegBtn() {
        regBtn.click();
    }

    public void clickLoginBtn() {
        loginBtn.click();
    }

}
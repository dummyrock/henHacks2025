import html from "./main.component.html";
import css from "./main.component.css";
import { EzComponent, Click, EventSubject,BindValue, BindCSSClass, BindStyle } from '@gsilber/webez';
import { UserHomepageComponent } from "../user_home/user_home.component";
import { LoginComponent } from "../login/login.component";
import { SignupComponent } from "../signup/signup.component";
import axios from "axios";

/**
 * @description MainComponent is the main component of the app
 * @extends EzComponent
 * 
 */

interface UserLogin {
    username: string;
    password: string;
}

  interface UserLogin {
    username: string;
    password: string;
}

interface ApiResponse {
    exists:boolean;
    userID:number;
}

async function createUser(userData: UserLogin) {
    try {
      const response = await axios.post<ApiResponse>(
        'http://128.4.102.9:8000/push-username-password/',
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'secret-key-123'
          },
        }
      );
      return response.data.userID;
    } catch (error) {
      console.error('Error creating user:', error);
      return -1;
    }
}

export class MainComponent extends EzComponent {
    
    @BindStyle("new-user", "display")
    public newDisplay: string = "none";
    private userHomepage: UserHomepageComponent = new UserHomepageComponent();
    private login: LoginComponent = new LoginComponent();
    private signup: SignupComponent = new SignupComponent();
    private userData!: UserLogin;
    private userID = 0;

    constructor() {
        super(html, css);
        this.addComponent(this.userHomepage, "user-homepage");
        this.removeLogin();
        this.removeSignup();
    }

    @Click("login")
    showLogin(){
        this.removeComponent(this.signup);
        this.addComponent(this.login, "entry");
    }
    @Click("signUp")
    showSignup(){
        this.removeComponent(this.login);
        this.addComponent(this.signup, "entry");
    }

    private removeLogin() {
        this.login.clickEvent.subscribe(async () => {
            this.userData = this.login.sendUserID();
            this.removeComponent(this.login);
            this.userID = await createUser(this.userData);
        });
    }
    private removeSignup() {
        this.signup.clickEvent.subscribe(() => {
            this.removeComponent(this.signup);
        });
    }
}


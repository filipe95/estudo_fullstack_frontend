import { Component, OnInit } from "@angular/core";
import { UserLogin } from "src/app/core/model/login";
import { ApiService } from "src/app/core/api.service";
import { Router } from "@angular/router";
import { MessageService } from "src/app/core/message.service";

@Component({
  selector: "app-login-user",
  templateUrl: "./login-user.component.html",
  styleUrls: ["./login-user.component.scss"]
})
export class LoginUserComponent implements OnInit {
  user = new UserLogin();
  submitted = false;
  isUserLogged = this.apiService.isUserLogged();

  constructor(
    private apiService: ApiService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    if (this.isUserLogged) 
      this.router.navigate(['/welcome']);    
  }

  public login() {
    this.submitted = true;
    this.apiService.login(this.user).subscribe(
      data => {
        this.loginSuccess(data);
        console.log(data);
      },
      error => {
        this.submitted = false;
        this.messageService.showError("Login", "Falha de autenticação");
      }
    );
  }

  public loginSuccess(data: any) {
    this.submitted = false;
    localStorage.clear();
    localStorage.setItem("accessToken", data.access_token);
    localStorage.setItem("refreshToken", data.refresh_token);
    this.apiService.getMainUser(localStorage.getItem("accessToken")).subscribe(
      user => {
        this.redirectPage(user);
        this.messageService.showSuccess(
          "Bem Vindo ao Sem Papel",
          "Integrador de Identidade"
        );
      },
      error => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        this.messageService.showError(
          "Usuário principal",
          "Falha ao carregar usuário principal"
        );
      }
    );
  }

  public redirectPage(user: any) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    this.router.navigate(["welcome"]);
  }

}

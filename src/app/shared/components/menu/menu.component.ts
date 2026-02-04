import { Component } from "@angular/core";
import { RouterModule, Router } from "@angular/router";
import { AuthService } from "../../../core/auth/auth.service";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  imports: [RouterModule],

})
export class MenuComponent {

  constructor(public auth: AuthService , private router: Router){}

  logout(){
    localStorage.clear()
    this.router.navigate(['/login']);
  }

}


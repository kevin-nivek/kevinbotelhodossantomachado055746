import { Injectable } from "@angular/core";
import { enviroment } from "../../../enviroment/enviroment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = `${enviroment.apiUrl}/autenticacao`;

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<{ access_token: string , refresh_token: string, expires_in: number }>(`${this.baseUrl}/login`, { username, password });
  }

  refresh(refreshToken: string) {
    return this.http.put<any>(`${this.baseUrl}/refresh`, {
      refreshToken: refreshToken
    });
  }

  isLogged(): boolean {
    return !!localStorage.getItem('token')
  }
}

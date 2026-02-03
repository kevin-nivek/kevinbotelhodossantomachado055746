import { Injectable } from "@angular/core";
import { enviroment } from "../../../enviroment/enviroment";
import { HttpClient } from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class HealthService{
  private readonly url = `${enviroment.apiUrl}`

  constructor(private http: HttpClient){}

  checkHealth(){
    return this.http.get(
      `${enviroment.apiUrl}/v1/pets`,
      { params: { page: 0, size: 1 } }
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { JwtResponse, User, UserLogin } from '../data-type';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  isUserLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {}

  userSignUp(data: User) {
    return this.http.post('http://localhost:8080/user-api/user', data);
  }

  reloadUser() {
    let JwtResponse = localStorage.getItem('JwtResponse');
    let JwtResponseObj = JwtResponse && JSON.parse(JwtResponse);
    if (JwtResponseObj && JwtResponseObj.user) {
      this.isUserLoggedIn.next(true);
      this.router.navigate(['home']);
    }
  }

  userLogin(data: UserLogin) {
    return this.http.post<JwtResponse>(
      'http://localhost:8080/authenticate/user',
      data
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { SignUp, Login } from '../data-type';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  isUserLoggedIn = new BehaviorSubject<boolean>(false);
  isLogIn = new EventEmitter<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {}

  userSignUp(data: SignUp) {
    return this.http.post('http://localhost:8080/user-api/user', data);
  }

  reloadUser() {
    if (localStorage.getItem('User')) {
      this.isUserLoggedIn.next(true);
      this.router.navigate(['home']);
    }
  }

  userLogin(data: Login) {
    this.http
      .get(
        `http://localhost:8080/user-api/user/email=${data.email}&password=${data.password}`,
        { observe: 'response' }
      )
      .subscribe((result: any) => {
        if (result && result.body && result.body.length) {
          delete result.body[0].password;
          localStorage.setItem('user', JSON.stringify(result.body));
          this.router.navigate(['home']);

          this.isLogIn.emit(false);
        } else {
          this.isLogIn.emit(true);
        }
      });
  }
}

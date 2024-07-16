import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserLogin } from '../data-type';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { Unsubscribe } from '../services/unsubscribe.class';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent extends Unsubscribe implements OnInit {
  changePasswordForm!: FormGroup;

  constructor(private userService: UserService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.changePasswordForm = new FormGroup({
      userDetail: new FormGroup({
        userName: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
      }),
      newPassword: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
    });
  }

  changePassword() {
    let newPassword = this.changePasswordForm.value.newPassword;
    let confirmPassword = this.changePasswordForm.value.confirmPassword;
    let user: UserLogin = this.changePasswordForm.value.userDetail;
    if (newPassword === confirmPassword) {
      this.userService
        .userLogin(user)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((res) => {
          if (res) {
            localStorage.setItem('JwtResponse', JSON.stringify(res));
            this.userService.getUserId().subscribe((res) => {
              this.userService
                .changePassword(res, confirmPassword)
                .subscribe((res) => {
                  if (res) {
                    localStorage.removeItem('JwtResponse');
                    this.router.navigate(['login']);
                  }
                });
            });
          }
        });
    } else {
      alert('Confirm password does not match');
    }
  }
}

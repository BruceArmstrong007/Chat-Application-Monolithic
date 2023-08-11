import { NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, FormsModule, ReactiveFormsModule, NgIf]
})
export class LoginPage implements OnInit {
  private readonly fb : FormBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  loginForm: FormGroup;
  constructor() {
    this.loginForm = this.fb.group({
      username: ['',Validators.compose([Validators.required, Validators.maxLength(25)])],
      password: ['',Validators.compose([Validators.required, Validators.minLength(8)])]
    })
   }

  ngOnInit() {
  }

  login(){
    if(this.loginForm.invalid){
      return;
    }
    this.authService.login(this.loginForm.value).subscribe((res)=> {
    })

  }

  get f(){
    return this.loginForm.controls;
  }

}

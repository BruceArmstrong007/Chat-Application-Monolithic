import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { ValidationService } from 'src/shared/services/validation.service';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  providers: [AuthService],
  standalone: true,
  imports: [IonicModule, RouterLink, FormsModule, ReactiveFormsModule, HttpClientModule, NgIf]
})
export class RegisterPage implements OnInit {
  private readonly passwordValidator = inject(ValidationService);
  private readonly authService = inject(AuthService);
  private readonly fb : FormBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  registerForm: FormGroup;
  constructor() {
    this.registerForm = this.fb.group({
      username: ['',Validators.compose([Validators.required,Validators.maxLength(25)])],
      password: ['',Validators.compose([Validators.required, Validators.minLength(8)])],
      confirmPassword: ['',Validators.compose([Validators.required, Validators.minLength(8)])]
    },{
      validators : (control: any) => this.passwordValidator.MatchValidator(control,"password",'confirmPassword')
    })
  }

  ngOnInit() {
  }

  register(){
    if(this.registerForm.invalid){
      return;
    }
    this.authService.register(this.registerForm.value).subscribe((res)=> {
    })

  }

  get f(){
    return this.registerForm.controls;
  }
}

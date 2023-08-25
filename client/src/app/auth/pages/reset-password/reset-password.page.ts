import { NgIf } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ValidationService } from 'src/shared/services/validation.service';
import { AuthService } from '../../services/auth.service';
import { UserStateI } from 'src/app/user/state/user.state';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, ReactiveFormsModule, NgIf]
})
export class ResetPasswordPage implements OnInit {
  @Input({required: true}) user!: Partial<UserStateI>;
  private readonly passwordValidator = inject(ValidationService);
  private readonly modalCtrl = inject(ModalController);
  private readonly authService = inject(AuthService);
  private readonly fb : FormBuilder = inject(FormBuilder);
  resetPasswordForm: FormGroup;
  constructor() {
    this.resetPasswordForm = this.fb.group({
      username: [{value: '', disabled: true},Validators.compose([Validators.required,Validators.maxLength(25)])],
      password: ['',Validators.compose([Validators.required, Validators.minLength(8)])],
      confirmPassword: ['',Validators.compose([Validators.required, Validators.minLength(8)])]
    },{
      validators : (control: FormControl<any>) => this.passwordValidator.MatchValidator(control,"password",'confirmPassword')
    })
   }

  ngOnInit() {
    this.resetPasswordForm.patchValue({
      username: this.user?.username
    });
  }

  resetPassword(){
    if(this.resetPasswordForm.invalid){
      return;
    }
    this.authService.resetPassword(this.resetPasswordForm.getRawValue()).subscribe(()=> {
      this.cancel();
    })
  }

  get f(){
    return this.resetPasswordForm.controls;
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}

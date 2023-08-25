import { NgIf } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { UserService } from 'src/app/user/services/user.service';
import { UserStateI } from 'src/app/user/state/user.state';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone:true,
  imports: [IonicModule, FormsModule, ReactiveFormsModule, NgIf]
})
export class ProfileComponent  implements OnInit {
  @Input({
    required:true,
  }) user!: Partial<UserStateI>;
  private readonly modalCtrl = inject(ModalController);
  private readonly fb : FormBuilder = inject(FormBuilder);
  private readonly userService = inject(UserService);
  profileForm: FormGroup;
  constructor() {
    this.profileForm = this.fb.group({
      name: ['',Validators.compose([Validators.required,Validators.maxLength(50)])],
      bio: ['',Validators.compose([Validators.required, Validators.maxLength(500)])],
      profileURL: ['',Validators.compose([Validators.required])]
    })
  }

  ngOnInit() {
    this.profileForm.patchValue({
      ...this.profileForm.value,
      ...this.user
    });
  }

  updateProfile(){
    if(this.profileForm.invalid || JSON.stringify(this.profileForm.value) == JSON.stringify(this.user)){
      return;
    }
    this.userService.updateProfile(this.profileForm.value).subscribe(()=> {
      this.cancel();
    })
  }

  get f(){
    return this.profileForm.controls;
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }


}

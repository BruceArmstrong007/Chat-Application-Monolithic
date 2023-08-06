import { ValidationErrors } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

   MatchValidator(control: any,key1:string,key2:string): ValidationErrors | null {
    if(control.value[key1] !== control.value[key2]){
      return control.controls[key2].setErrors({ ...(control?.controls[key2]?.errors || {}),mismatch: true });
    }
    let errors = {...(control.controls[key2]?.errors || {})};
    if(errors?.mismatch){
      delete errors.mismatch;
    }
    if(Object.keys(errors).length == 0) errors = null;
    return control.controls[key2].setErrors(errors);
  }
}

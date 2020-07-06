import { Component, OnInit, ErrorHandler } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from 'src/app/components/modal/modal.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  title = 'bsb-app';
  form: FormGroup;
  registered = false;
  user_details;

  constructor(
    public matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private errorHandler: ErrorHandler,
    ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      email: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]]
    });
  }
  

  openRegisterModal(){
    const email = this.form.get('email').value;

    console.log(this.form.get('email').value);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.width = "600px";
    dialogConfig.data = { 
      email: email
    }
    const modalDialog = this.matDialog.open(ModalComponent, dialogConfig);

    modalDialog.afterClosed().subscribe(result => {
      if (result) {
        this.registered = true;
        this.user_details = result;

        console.log("Result is TRUE!", result);
      }
  });

  }

}

import { Component, OnInit, inject } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.css'
})
export class ConfirmComponent implements OnInit{

  private categoryService = inject(CategoryService);
  private dialogRef = inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    
  }

  // Candel Delete
  onNoClick(){
     this.dialogRef.close(3);
  }


  //Confirm
  delete(){
    if(this.data!=null){
          this.categoryService.deleteCategory(this.data.id)
          .subscribe({
            next: (data:any)=>{
                  this.dialogRef.close(1);
            },
            error:(err:any)=>{
              this.dialogRef.close(2);
            }
          });
    }
    else{
          this.dialogRef.close(2);
    }
  }



};



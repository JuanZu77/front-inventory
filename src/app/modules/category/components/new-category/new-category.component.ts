import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../shared/services/category.service';
import { subscribe } from 'diagnostics_channel';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { error } from 'console';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrl: './new-category.component.css'
})
export class NewCategoryComponent implements OnInit {
  
  public categoryForm!: FormGroup;
  private fb= inject(FormBuilder);
  
  private categoryService = inject(CategoryService);
  private dialogRef = inject(MatDialogRef);

  public data = inject(MAT_DIALOG_DATA);//update data

  //State form update categories
  stateForm: string = "";
  
  ngOnInit(): void {  

    this.stateForm="Agregar"

    this.categoryForm = this.fb.group({
      name:['',Validators.required],
      description:['',Validators.required]
    })

    if(this.data!= null){
     this.updateForm(this.data);
     this.stateForm="Actualizar"
    }
  };


 /**
  * Add new category or UPDATE category
  */ 
  onSave(){

    let data = {
      name: this.categoryForm.get('name')?.value,
      description: this.categoryForm.get('description')?.value
    }

    if(this.data!=null){ //update registry

      this.categoryService.updateCategory(data, this.data.id)
      .subscribe({
        next: (data:any)=>{
          console.log(data);
          this.dialogRef.close(1);
        },
        error: (err:any)=>{
          console.log(err.error.msg)
          this.dialogRef.close(2);
        }
      })
    }
    else{ //create new registry

       /*We use saveCategory from CategoryService*/
    this.categoryService.saveCategory(data)
    .subscribe({
               next: (data:any) =>{
                    console.log(data);
                    this.dialogRef.close(1);
               },
               error: (err:any)=>{
                   console.log(err.error.msg)
                   this.dialogRef.close(2);   
               }
     });
    }

   
  };

/**
 * Button Cancel Add category
 */
  onCancel(){
    this.dialogRef.close(3);  /*lo cerramos son mostrar mensajes */
  };


/**
 * Update Category with wdit button
 * @param data 
 */
  updateForm(data:any){
    this.categoryForm = this.fb.group({
      name:[data.name, Validators.required],
      description:[data.description ,Validators.required]
    })
  };


}

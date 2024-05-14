import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../shared/services/product.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../../shared/services/category.service';


export interface Category {
  id: number,
  description:string,
  name: string
}

@Component({
  selector: 'app-form-save-product',
  templateUrl: './form-save-product.component.html',
  styleUrl: './form-save-product.component.css'
})
export class FormSaveProductComponent implements OnInit{
 
  public productForm!: FormGroup;
  private fb= inject(FormBuilder);
  
  private productService = inject(ProductService);
  private dialogRef = inject(MatDialogRef);

  public data = inject(MAT_DIALOG_DATA);//update data

  private categoryService = inject(CategoryService)
  categories: Category[]=[];

  //IMG onFileChanged()
  selectedFile:any;
  nameImg:string="";

  //State form update products
  stateForm: string = "";
  
  ngOnInit(): void {  

    this.getCategories();
    this.stateForm="Agregar"

    this.productForm = this.fb.group({
      name:['',Validators.required],
      price:['',Validators.required],
      account:['',Validators.required],
      category:['',Validators.required],
      picture:['',Validators.required],

    });

    if(this.data!= null){
     this.updateForm(this.data);
     this.stateForm="Actualizar"
    }
  };


//Get category for product create (formSaveProduct)
  getCategories(){
    this.categoryService.getCategories()
    .subscribe({
      next: (data:any)=>{
             console.log(data);
             this.categories = data.categoryResponse.category;
      },
      error: (err:any)=>{
        console.log("Error al consultar", err.error.msg);
      }
    })
  }

  onSave(){
       let data = {
        name: this.productForm.get('name')?.value,
        price: this.productForm.get('price')?.value,
        account: this.productForm.get('account')?.value,
        category: this.productForm.get('category')?.value,
        picture: this.selectedFile 
       }

       //send image and data
       const uploadImageData = new FormData();
       uploadImageData.append('picture', data.picture, data.picture.name);
       uploadImageData.append('name',data.name);
       uploadImageData.append('price',data.price);
       uploadImageData.append('account',data.account);
       uploadImageData.append('categoryId',data.category);

      //UPDATE - If there is information to update
      if(this.data != null){
        this.productService.updateProduct(uploadImageData, this.data.id)
        .subscribe({
          next: (data:any)=>{
                this.dialogRef.close(1)
          },
          error:(err:any)=>{
                this.dialogRef.close(2);
          }
        });
       
      }else{
        //SAVE PRODUCT - call the service to save a product
       this.productService.saveProducts(uploadImageData)
          .subscribe({
            next: (data:any)=>{
                  this.dialogRef.close(1)
            },
            error:(err:any)=>{
                  this.dialogRef.close(2);
            }
          });
      }
  };


  //Closed Modal
  onCancel(){
  this.dialogRef.close(3);
  };


  //Acceder a los datos de la imagen
  onFileChanged(event:any){

    this.selectedFile = event.target.files[0]; //acceder a las prop del archivo
    console.log(this.selectedFile);

    this.nameImg = event.target.files[0].name; //recuperar el nombre
  };


  /**
 * Update Product with edit button
 * @param data 
 */
  updateForm(data:any){
    this.productForm = this.fb.group({
      name:[data.name, Validators.required],
      price:[data.price ,Validators.required],
      account:[data.account, Validators.required],
      category:[data.category.id, Validators.required],
      picture:[data.picture, Validators.required],
    });
  };



};

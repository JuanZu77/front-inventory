import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from '../../../shared/services/product.service';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FormSaveProductComponent } from '../form-save-product/form-save-product.component';
import { ConfirmComponent } from '../../../shared/components/confirm/confirm.component';
import { UtilService } from '../../../shared/services/util.service';


export interface ProductElement{
  id: number,
  name: string,
  price: number,
  account: number,
  category: any
  picture: any
}


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit{

  isAdmin:any

  private productService = inject(ProductService);
  private snackBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);

  private util = inject(UtilService)

  ngOnInit(): void {
    this.getProducts();
    this.isAdmin = this.util.isAdmin();
  }
  displayedColumns:string[]=['id','name','price','account', 'category', 'picture', 'actions'];
  dataSource = new MatTableDataSource<ProductElement>();


//PAGINATION
     @ViewChild(MatPaginator)
     paginator!: MatPaginator;

    
     getProducts(){

      this.productService.getProducts()
      .subscribe({
        next:(data:any)=>{
          this.processProductResponse(data);
          console.log(data);
        },
        error:(err:any)=>{
          console.log(err.error.msg)
        }
      });
     };

     processProductResponse(res:any){

      const dataProduct: ProductElement[]=[];

      if(res.metadata[0].code =="00"){
         let listProduct = res.productResponse.products; 

         listProduct.forEach((element: ProductElement)=>{
         //element.category = element.name;
         element.picture = 'data:image/jpeg;base64,'+ element.picture;

         dataProduct.push(element);
         });

         //set the data source
         this.dataSource = new MatTableDataSource<ProductElement>(dataProduct);
         this.dataSource.paginator= this.paginator;
      }
     };



     //Method Open Dialog to Save Products
     openProductDialog(){
      const dialogRef = this.dialog.open(FormSaveProductComponent, {
        width:'450px',
      });
  
      dialogRef.afterClosed().subscribe((result:any) => {
        
        if(result==1){
          this.openSnackBar("Producto Agregado", "Operación Exitosa");
          this.getProducts();

        }else if(result==2){
          this.openSnackBar("Error al Guardar el Producto", "Error");
          this.getProducts();
        }
      });
    };

      //SNACK 
      openSnackBar(message: string, action:string):MatSnackBarRef<SimpleSnackBar> {

        return this.snackBar.open(message, action, {
          duration:2000
        })
      };


     /**
      * UPDATE
      * @param id 
      * @param name 
      * @param price 
      * @param account 
      * @param category 
      * @param picture 
      */
      edit(id:number, name:string, price:number, account:number, category:any, picture:any){

        const dialogRef = this.dialog.open(FormSaveProductComponent, {
          width:'450px',
          data:{ id:id, 
                 name:name, 
                 price:price,
                 account:account,
                 category:category,
                 picture:picture
                }
        });
    
        dialogRef.afterClosed().subscribe((result:any) => {
          
          if(result==1){
            this.openSnackBar("Producto Actualizado", "Operación Exitosa");
            this.getProducts();
  
          }else if(result==2){
            this.openSnackBar("Error al Editar el Producto", "Error");
            this.getProducts();
          }
        });
      };



      //DELETE
      delete(id:any){
        const dialogRef = this.dialog.open(ConfirmComponent, {
          width:'450px',
          data:{ id:id, module:"product"}, 
        });
    

        dialogRef.afterClosed().subscribe((result:any) => {
          if(result==1){
            this.openSnackBar("Producto Eliminado", "Operación Exitosa");
            this.getProducts();
  
          }else if(result==2){
            this.openSnackBar("Error al Eliminar el Producto", "Error");
            this.getProducts();
          }
        });
      };

      //SEARCH
      search(name:any){

        if(name.length === 0 ){
           return this.getProducts();
        }

        this.productService.getProductByName(name)
        .subscribe({
          next: (data:any)=>{
             this.processProductResponse(data)
          },
          error: (err:any)=>{
            console.log(err.error.msg)
          }
        })
        
      }


};

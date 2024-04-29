import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from '../../../shared/services/product.service';


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

  private productService = inject(ProductService);

  ngOnInit(): void {
    this.getProducts();
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
         element.category = element.name;
         element.picture = 'data:image/jpeg;base64,'+ element.picture;

         dataProduct.push(element);
         });

         //seteamos el data source
         this.dataSource = new MatTableDataSource<ProductElement>(dataProduct);
         this.dataSource.paginator= this.paginator;
      }

     }



};

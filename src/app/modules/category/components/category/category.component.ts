import { Component, OnInit, inject } from '@angular/core';
import { CategoryService } from '../../../shared/services/category.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { NewCategoryComponent } from '../new-category/new-category.component';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

export interface CategoryElement{
  id:number,
  description: string,
  name: string
};

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit{
  
  private categoryServices = inject(CategoryService);
  
  public dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);  
  
  ngOnInit(): void {
    this.getCategories();
  }
  displayedColumns:string[]=['id','name','description','actions'];
  dataSource = new MatTableDataSource<CategoryElement>();



      getCategories():void{
      
        this.categoryServices.getCategories()
        .subscribe(
                  {
                    next: (data:any) =>{
                      console.log(data);
                      this.processCategoriesResponse(data);
                    },
                    error: (err:any) =>{
                      console.log(err.error.msg)
                    }
                  }
                );
      }

      processCategoriesResponse(resp:any){

        const dataCategory: CategoryElement[]=[];

        if(resp.metadata[0].code=="00"){
            let listCategory = resp.categoryResponse.category;

            listCategory.forEach((element:CategoryElement) => {
              dataCategory.push(element);
            });

            this.dataSource = new MatTableDataSource<CategoryElement>(dataCategory);
        }

      }


      openCategoryDialog(){
        const dialogRef = this.dialog.open(NewCategoryComponent, {
          width:'450px',
          //data: {name: this.name, animal: this.animal},
        });
    
        dialogRef.afterClosed().subscribe((result:any) => {
          
          if(result==1){
            this.openSnackBar("Categoría Agregada", "Exitosa");
            this.getCategories();
 
          }else if(result==2){
            this.openSnackBar("Error al Guardar Categoría", "Error");
            this.getCategories();
          }
        });
      };


      openSnackBar(message: string, action:string):MatSnackBarRef<SimpleSnackBar> {

        return this.snackBar.open(message, action, {
          duration:2000
        })

      };

}

import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CategoryService } from '../../../shared/services/category.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { NewCategoryComponent } from '../new-category/new-category.component';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from '../../../shared/components/confirm/confirm.component';
import { MatPaginator } from '@angular/material/paginator';
import { UtilService } from '../../../shared/services/util.service';
import { error } from 'console';


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

  isAdmin: any
  
  private categoryServices = inject(CategoryService);
  
  public dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar); 
  private util = inject(UtilService); //keycloakService
  
  ngOnInit(): void {
    this.getCategories();
    //console.log(this.util.getRoles());
    this.isAdmin = this.util.isAdmin();
  }
  displayedColumns:string[]=['id','name','description','actions'];
  dataSource = new MatTableDataSource<CategoryElement>();


//PAGINATION
     @ViewChild(MatPaginator)
     paginator!: MatPaginator;
  

//GET Categories
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


//Process Categories 
      processCategoriesResponse(resp:any){

        const dataCategory: CategoryElement[]=[];

        if(resp.metadata[0].code=="00"){
            let listCategory = resp.categoryResponse.category;

            listCategory.forEach((element:CategoryElement) => {
              dataCategory.push(element);
            });

            this.dataSource = new MatTableDataSource<CategoryElement>(dataCategory);
            this.dataSource.paginator = this.paginator;
        }

      }


//DIALOG    
      openCategoryDialog(){
        const dialogRef = this.dialog.open(NewCategoryComponent, {
          width:'450px',
          //data: {name: this.name, animal: this.animal},
        });
    
        dialogRef.afterClosed().subscribe((result:any) => {
          
          if(result==1){
            this.openSnackBar("Categoría Agregada", "Operación Exitosa");
            this.getCategories();
 
          }else if(result==2){
            this.openSnackBar("Error al Guardar Categoría", "Error");
            this.getCategories();
          }
        });
      };


//SNACK 
      openSnackBar(message: string, action:string):MatSnackBarRef<SimpleSnackBar> {

        return this.snackBar.open(message, action, {
          duration:2000
        })

      };

//EXCEL REPORT
      exportExcel(){
         this.categoryServices.exportCategory()
         .subscribe((data:any)=>{
          //defino tipo de archivo(con el string de type)
          let file = new Blob([data],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});

          let fileUrl = URL.createObjectURL(file);
          var anchor = document.createElement("a");
          anchor.download = "categories.xlsx";
          anchor.href = fileUrl;
          anchor.click();

          this.openSnackBar("Archivo exportado correctamente", "Descarga Exitosa");
         }, (error:any)=>{
          this.openSnackBar("Error al exportar el archivo", "No se pudo descargar el archivo");
         })
      }



 //UPDATE Categories
      edit(id: number, name:string, description: string){
        
        const dialogRef = this.dialog.open(NewCategoryComponent, {
          width:'450px',
          data: {id: id, name: name, description: description},
        });
    
        dialogRef.afterClosed().subscribe((result:any) => {
          
          if(result==1){
            this.openSnackBar("Categoría Actualizada", "Operación Exitosa");
            this.getCategories();
 
          }else if(result==2){
            this.openSnackBar("Error al Actualizar Categoría", "Error");
            this.getCategories();
          }
        });
      }


//Delete Categories
      delete(id:any){

        const dialogRef = this.dialog.open(ConfirmComponent, {
          width:'450px',
          data: { id: id, module:"category" },
        });
    
       
        dialogRef.afterClosed().subscribe((result:any) => {
          
          if(result==1){
            this.openSnackBar("Categoría Eliminada", "Operación Exitosa");
            this.getCategories();
 
          }else if(result==2){
            this.openSnackBar("Error al Eliminar Categoría", "Error");
            this.getCategories();
          }
        });
              
      }



//SEARCH category by id
      search(termino:string){
          if(termino.length === 0){
              return this.getCategories();
          }

          this.categoryServices.getCategoryById(termino)
          .subscribe({
            next:(resp:any)=>{
              this.processCategoriesResponse(resp);
            },
            error:(err:any)=>{
              console.log(err.error.msg)
            }

          });
      }


};

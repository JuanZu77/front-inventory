import { Component, OnInit, inject } from '@angular/core';
import { CategoryService } from '../../../shared/services/category.service';
import { MatTableDataSource } from '@angular/material/table';

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
}

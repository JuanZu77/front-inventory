import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


const base_url = "http://localhost:8080/api/v1";

@Injectable({
  providedIn: 'root'
})

export class CategoryService {

  constructor(private http: HttpClient) {}

  /**
   * get all categories
   * @returns 
   */
  getCategories(){
    const endpoint = `${base_url}/categories`;
    return this.http.get(endpoint)
  }

  /**
   * save category
   * @param body 
   * @returns 
   */
  saveCategory(body:any){
    const endpoint= `${base_url}/categories`;
    return this.http.post(endpoint, body);
  }


  /**
   * 
   * @param body 
   * @param id 
   * @returns 
   */
  updateCategory(body:any, id:any){
    const endpoint= `${base_url}/categories/${id}`;
    return this.http.put(endpoint, body);
  }

  /**
   * delete registry
   * @param id 
   * @returns 
   */
  deleteCategory(id:any){
    const endpoint= `${base_url}/categories/${id}`;
    return this.http.delete(endpoint);
  }


  /**
   * search category by ID
   * @param id 
   * @returns 
   */
  getCategoryById(id:any){
    const endpoint= `${base_url}/categories/${id}`;
    return this.http.get(endpoint);
  }
  

}


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const base_url = "http://localhost:8080/api/v1";


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  /**
   * get all products
   * @returns 
   */
  getProducts(){
    const endpoint = `${base_url}/products`;
    return this.http.get(endpoint)
  };

  /**
   * save products
   * @param body 
   * @returns 
   */
  saveProducts(body:any){
    const endpoint = `${base_url}/products`;
    return this.http.post(endpoint, body)
  };


  /**
   * update products
   * @param body 
   * @param id 
   * @returns 
   */
  updateProduct (body:any, id:any) {
    const endpoint = `${base_url}/products/${id}`;
    return this.http.put(endpoint, body)
  }


  /**
   * delete products
   * @param id 
   * @returns 
   */
  deleteProduct(id:any){
    const endpoint = `${base_url}/products/${id}`;
    return this.http.delete(endpoint)
  }

  



};

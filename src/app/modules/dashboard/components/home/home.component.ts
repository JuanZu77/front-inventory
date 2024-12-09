import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { ProductService } from '../../../shared/services/product.service';
import { ProductElement } from '../../../product/component/product/product.component';
import { Chart } from 'chart.js';
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  chartBar: any;
  chartDoughnut: any;
  private productService = inject(ProductService);

  constructor(private platform: Platform) {}

  ngOnInit(): void {
    //this.getProducts();
  }

  ngAfterViewInit(): void {
    if (this.platform.isBrowser) {
      this.getProducts();
    }
  }

  getProducts() {
    this.productService.getProducts()
      .subscribe({
        next: (data: any) => {
          this.processProductResponse(data);
          //console.log(data);
        },
        error: (err: any) => {
          console.log(err.error.msg);
        }
      });
  }

  processProductResponse(res: any) {
    const nameProduct: String[] = [];
    const account: number[] = [];

    if (res.metadata[0].code == "00") {
      let listProduct = res.productResponse.products;

      listProduct.forEach((element: ProductElement) => {
        nameProduct.push(element.name);
        account.push(element.account);
      });

        // solo acceder al DOM si estamos en el navegador
        if (this.platform.isBrowser) {
          const canvas = document.getElementById('canvas-bar') as HTMLCanvasElement;
          const ctx = canvas.getContext('2d');

            if (ctx) {
              // creo grafico usando context 2D
              this.chartBar = new Chart(ctx, {
                type: 'bar',
                data: {
                  labels: nameProduct,
                  datasets: [
                    { label: 'Productos', data: account }
                  ]
                }
              });
            } else {
              console.error('No se pudo obtener el contexto 2D del canvas');
            }
        }


        if (this.platform.isBrowser) {
          const canvas = document.getElementById('canvas-doughnut') as HTMLCanvasElement;
          const ctx = canvas.getContext('2d');

          if (ctx) {
            // creo grafico usando context 2D
            this.chartDoughnut = new Chart(ctx, {
              type: 'doughnut',
              data: {
                labels: nameProduct,
                datasets: [
                  { label: 'Productos', data: account }
                ]
              }
            });
          } else {
            console.error('No se pudo obtener el contexto 2D del canvas');
          }
        }
    }
  } //process

}




import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {

  productCategories!: ProductCategory[];  // ! to show that it can be empty also or do productCategories: ProductCategory[]= [];
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.listProductCategories();
  }

  listProductCategories()
  {
    this.productService.getProductCategories().subscribe(
      data => {
        console.log("Product Categories=" + JSON.stringify(data));
        this.productCategories = data;
      }
    );
  }

  show(category: ProductCategory)
  {
    console.log("Category=" + category.categoryName);
  }
}

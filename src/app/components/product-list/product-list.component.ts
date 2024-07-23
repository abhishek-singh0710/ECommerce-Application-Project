import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName!: string;
  searchMode: boolean = false;

  // New Properties For Pagination
  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0; 
  
  previousKeyword: string = "";

  constructor(private productService: ProductService, 
              private route: ActivatedRoute,
              private cartService: CartService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has("keyword");

    if(this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {

    const theKeyword: string = this.route.snapshot.paramMap.get("keyword")!;

    // If we have a different keyword than the previous one then we will set thePageNumber to 1
    // Similar to how we were doing for the categoryId changes

    if(this.previousKeyword != theKeyword)
    {
      this.thePageNumber = 1;
    }
    this.previousKeyword = theKeyword;
    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);

    // Now to search for the products using the Keyword
    // this.productService.searchProducts(theKeyword).subscribe(
    //   data => {
    //     this.products = data;
    //   }
    // );

    // Now To Use The searchProductsPaginate() Method
    this.productService.searchProductsPaginate(this.thePageNumber -1,
                                                this.thePageSize,
                                                theKeyword).subscribe(this.processResult()  // processResult() function is defined below
    );
  }

  handleListProducts()
  {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has("id");

    if(hasCategoryId)
    {
      this.currentCategoryId = +this.route.snapshot.paramMap.get("id")!; // Using + to convert from string to number(integer) and Using ! to tell the compiler that it is not null.
      this.currentCategoryName = this.route.snapshot.paramMap.get("name")!;
    }
    else{
      this.currentCategoryId = 1;
      this.currentCategoryName = "Books";
    }

    // this.productService.getProductList().subscribe(
    //   data => {
    //     this.products = data;
    //   }
    // )          NOW WE WILL HAVE TO UPDATE THIS METHOD TO UPDATE THE PARAMETER CURRENTCATEGORYID

    if(this.previousCategoryId != this.currentCategoryId)
    {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    // NOW To Get The Products For The Given Category Id
    // this.productService.getProductList(this.currentCategoryId).subscribe(
    //   data => {
    //     this.products = data;
    //   }
    // )

    // Now Getting The Products Using Pagination
    this.productService.getProductListPaginate(this.thePageNumber -1,
                                               this.thePageSize,
                                               this.currentCategoryId)
                                               .subscribe(
                                                data => {                                         // Instead of doing this can also call the processResult() Function since same thing is being done there
                                                  this.products = data._embedded.products;
                                                  this.thePageNumber = data.page.number +1;
                                                  this.thePageSize = data.page.size;
                                                  this.theTotalElements = data.page.totalElements;
                                                }
                                            
    );
  }

  updatePageSize(pageSize: string) {
    this.thePageSize= +pageSize;
    this.thePageNumber = 1;
    this.listProducts();    // Now again calling the listProducts() function method
  }

  // This Is To Avoid The Same Code Two Time In The productListPaginate() Function And The searchProductsPaginate() Function
    processResult()
    {
      return (data: any) => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      };
    }

    addToCart(theProduct: Product) {
      console.log(`Adding To Cart: ${theProduct.name}, ${theProduct.unitPrice}`);

      // Now to call the CartService
      const theCartItem = new CartItem(theProduct);

      this.cartService.addToCart(theCartItem);
    }
}

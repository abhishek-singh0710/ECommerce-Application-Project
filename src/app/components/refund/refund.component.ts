import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RefundServiceService } from 'src/app/services/refund-service.service';

@Component({
  selector: 'app-refund',
  templateUrl: './refund.component.html',
  styleUrls: ['./refund.component.css']
})
export class RefundComponent implements OnInit {

  @ViewChild('orderid') orderId!: ElementRef;
  @ViewChild('email') email!: ElementRef;
  constructor(private refundService: RefundServiceService, private router: Router) { }

  ngOnInit(): void {
  }

  goToProducts() {
    this.router.navigateByUrl('/products');
  }
  onSubmit() {
    if(this.orderId.nativeElement.value === '' || this.email.nativeElement.value === '') {
      alert("Please enter the orderId and your email");
    }
    else {
   this.refundService.refund(this.orderId.nativeElement.value, this.email.nativeElement.value).subscribe(
    data => {
      console.log(data);
      alert(`Refund Initiated For Order Id: ${this.orderId.nativeElement.value}`);
      this.goToProducts();
    }
   )
  }
  }

}

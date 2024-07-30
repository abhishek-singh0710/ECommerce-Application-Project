import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appLazyLoadImage]'
})
export class LazyLoadImageDirective implements AfterViewInit{

  @Input() appLazyLoadImage!: string;

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    const img = this.el.nativeElement as HTMLImageElement;
    const observer = new IntersectionObserver((entries) => {  // Intersection Observer tells when the element comes in the viewport

      // then we apply the img source link to the img element and display it on the webpage in the browser

      entries.forEach(entry => {
        if(entry.isIntersecting) {
          console.log('Image is in view');
          img.src = this.appLazyLoadImage;
          observer.unobserve(img);   // Now it stops observing the image since the image has already been rendered
        }
      });
    });

    observer.observe(img);  // after this it will again start observing the image and see when the visibility of the image changes
  }
}

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductService } from './product.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private productService: ProductService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let JwtResponseObj = this.productService.getJwtResponseObj();

    if (JwtResponseObj) {
      const clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${JwtResponseObj.jwtToken}`,
        },
      });
      return next.handle(clonedRequest);
    }
    return next.handle(request);
  }
}

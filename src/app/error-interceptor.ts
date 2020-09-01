import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ErrorComponent } from "./error/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(public dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = "An unknown error occured!";
        if (error.error.message) {
          errorMsg = error.error.message;
          console.log("interceptor msg: ", errorMsg);
        }
        this.dialog.open(ErrorComponent, {
          // width: "100px",
          // height: "100px",
          data: { message: errorMsg },
        });
        return throwError(error);
      })
    );
  }
}

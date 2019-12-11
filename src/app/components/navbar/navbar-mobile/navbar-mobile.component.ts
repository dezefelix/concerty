import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../_services/auth.service';

@Component({
  selector: 'app-navbar-mobile',
  templateUrl: './navbar-mobile.component.html',
  styleUrls: ['./navbar-mobile.component.scss']
})
export class NavbarMobileComponent implements OnInit {
  isAuthenticated = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.authService.isAuthenticatedObs.subscribe(status => {
      this.isAuthenticated = status;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}

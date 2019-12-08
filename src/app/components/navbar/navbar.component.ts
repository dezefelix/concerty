import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  loggedIn = false;

  constructor(private authService: AuthService) {
    this.authService.loginStatus.subscribe(status => this.loggedIn = status);
  }

  ngOnInit() {
  }

  logout(): void {
    this.authService.logout();
  }
}

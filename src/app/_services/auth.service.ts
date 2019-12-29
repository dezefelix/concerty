import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {CacheService} from './cache.service';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {UserService} from './user.service';
import {Router} from '@angular/router';
import {User} from '../_models/user.model';
import {Role} from '../_enums/role.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly url = environment.serverUrlPrefix + 'auth/login';
  private currentUser: User;
  isAuthenticatedSubject = new BehaviorSubject<User>(this.currentUser);

  constructor(private http: HttpClient,
              private userService: UserService,
              private cache: CacheService,
              private router: Router) {
    this.readCurrentUserFromCache();
    this.establishLoginSession();
  }

  login(email: string, password: string): Promise<string> {
    const body = {email, password};

    return new Promise((resolve, reject) => {
      this.http.post(this.url, body).toPromise()
        .then(response => {
          this.cache.setToken(response['token']);
          let user = response['user'];
          user = this.userService.replaceConcertIdsWithConcerts(user);
          this.updateAuthentication(user);
          resolve();
        })
        .catch(reason => {
          this.updateAuthentication();
          reject();
        });
    });
  }

  logout(): void {
    this.cache.removeToken();
    this.cache.removeUser();
    this.router.navigateByUrl('login');
    this.isAuthenticatedSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = this.cache.getToken();
    const user = this.getCurrentUser();
    return !!token && !!user;
  }

  isAdministrator(): boolean {
    return this.currentUser.role === Role.ADMIN;
  }

  getCurrentUser(): User {
    if (this.currentUser) {
      return this.currentUser;
    } else {
      return this.cache.getUser();
    }
  }

  updateAuthentication(user: User = null): void {
    const token = this.cache.getToken();
    if (!token || !user) {
      this.logout();
    } else {
      this.currentUser = user;
      this.cache.setUser(user);
      this.isAuthenticatedSubject.next(user);
    }
  }

  private readCurrentUserFromCache(): void {
    this.currentUser = this.cache.getUser();
    this.isAuthenticatedSubject.next(this.currentUser);
  }

  private establishLoginSession() {
    this.readCurrentUserFromCache();

    if (this.currentUser) {
      this.userService.getUser(this.currentUser._id)
        .subscribe(user => {
          if (!!user) {
            this.updateAuthentication(user);
          }
        });
    } else {
      this.logout();
    }
  }
}

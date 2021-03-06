import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {CacheService} from './cache.service';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {UserService} from './user.service';
import {Router} from '@angular/router';
import {User} from '../_models/user.model';
import {Role} from '../_enums/role.enum';
import {ConcertService} from './concert.service';
import {NotificationService} from './notification.service';
import {Concert} from '../_models/concert.model';

@Injectable()
export class AuthService {
  private readonly url = environment.serverUrlPrefix + 'auth/login';
  private currentUser: User;
  private concerts: Concert[] = [];
  currentUserSub = new BehaviorSubject<User>(this.currentUser);

  constructor(private userService: UserService,
              private notifier: NotificationService,
              private cache: CacheService,
              private http: HttpClient,
              private router: Router,
              private concertService: ConcertService) {

    // TODO: ConcertService is not initialized when AuthService is, so logic below doesnt run properly.
    // this.concertService.concertsSub
    //   .subscribe(concerts => {
    //     if (concerts && concerts.length > 0) {
    //       this.convertEmbeddedConcerts(concerts);
    //     }
    //   });
  }

  login(email: string, password: string): Promise<string> {
    const body = {email, password};

    return new Promise((resolve, reject) => {
      this.http.post<User>(this.url, body)
        .toPromise()
        .then(response => {
          this.cache.setToken(response['token']);
          let user = response['user'];
          this.emitCurrentUser(user);
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  isAuthenticated(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const token = this.cache.getToken();
      const user = this.cache.getUser();

      if (!!token && !!user) {
        return this.userService.getUser(user._id)
          .then(user => {
            if (user) {
              this.emitCurrentUser(user);
              resolve(true);
            }
          })
          .catch(_ => {
            this.logout();
            reject(false)
          })
      }
    });
  }


  // Resolve(true) is admin. resolve(false) is user. Reject is unauthenticated and unauthorized.
  // TODO: This leaves a lot to the imagination! Don't do this!
  isAdministrator(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const token = this.cache.getToken();
      const user = this.cache.getUser();

      if (!!token && !!user) {
        return this.userService.getUser(user._id)
          .then(user => {
            if (user.role === Role.ADMIN) {
              resolve(true);
            } else {
              resolve(false);
            }
          })
          .catch(_ => {
            this.logout();
            reject(false)
          })
      }
    });
  }

  logout(): void {
    this.cache.removeToken();
    this.cache.removeUser();
    this.router.navigateByUrl('login');
    this.currentUserSub.next(null);
  }

  private emitCurrentUser(user: User): void {
    user = User.getEmbeddedConcertForTickets(user, this.concerts);
    this.currentUser = user;
    this.cache.setUser(user);
    this.currentUserSub.next(user);
  }
}

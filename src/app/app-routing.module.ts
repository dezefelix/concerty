import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ArtistsComponent} from './components/artists/artists.component';
import {ArtistDetailsComponent} from './components/artists/artist-details/artist-details.component';
import {ConcertsComponent} from './components/concerts/concerts.component';
import {ConcertDetailsComponent} from './components/concerts/concert-details/concert-details.component';
import {LoginComponent} from './components/login/login.component';
import {HomeComponent} from './components/home/home.component';
import {AboutComponent} from './components/about/about.component';
import {RegisterComponent} from './components/register/register.component';
import {AuthUserGuard} from './auth-user.guard';
import {AuthAdministratorGuard} from './auth-administrator.guard';
import {AccountComponent} from './components/account/account.component';
import {TicketsComponent} from './components/account/tickets/tickets.component';
import {ProfileComponent} from './components/account/profile/profile.component';
import {ArtistManagementComponent} from './components/administrator/artist-management/artist-management.component';
import {ConcertManagementComponent} from './components/administrator/concert-management/concert-management.component';
import {AdministratorComponent} from './components/administrator/administrator.component';
import {TicketDetailsComponent} from './components/account/tickets/ticket-details/ticket-details.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'artists', component: ArtistsComponent,
    children: [
      { path: ':key', component: ArtistDetailsComponent }
    ]
  },
  { path: 'concerts', component: ConcertsComponent,
    children: [
      { path: ':key', component: ConcertDetailsComponent }
    ]
  },
  { path: 'about', component: AboutComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'account', component: AccountComponent, canActivate: [AuthUserGuard],
    children: [
      { path: 'tickets', component: TicketsComponent, children: [
          { path: ':id', component: TicketDetailsComponent }
        ]
      },
      { path: 'profile', component: ProfileComponent },
  ]},
  { path: 'administrator', component: AdministratorComponent, canActivate: [AuthAdministratorGuard],
    children: [
      { path: 'artists', component: ArtistManagementComponent },
      { path: 'concerts', component: ConcertManagementComponent },
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

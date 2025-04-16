import { Route, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { authGuard } from './guards/auth/auth.guard';
import { CreateRideComponent } from './pages/create-ride/create-ride.component';
import { SearchRideComponent } from './pages/search-ride/search-ride.component';
import { TrainRideDetailsComponent } from './pages/train-ride-details/train-ride-details.component';
import { CarEventComponent } from './pages/car-event/car-event.component';
import { CarRideDetailsComponent } from './pages/car-ride-details/car-ride-details.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TrainEventComponent } from './pages/train-event/train-event.component';

export const appRoutes: Route[] = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'create-ride', component: CreateRideComponent },
  { path: 'search-ride', component: SearchRideComponent },
  { path: 'train-ride-details', component: TrainRideDetailsComponent },
  { path: 'car-ride-details', component: CarRideDetailsComponent },
  { path: 'car-event/:id', component: CarEventComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'train-event', component: TrainEventComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  providers: []
})
export class AppRoutingModule {
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from './components/notfound/notfound.component';

const routes: Routes = [
  {
    path:'',
    loadChildren:() => import('src/app/screens/home/home.module').then(m => m.HomeModule)
  },
  {
    path:'auth',
    loadChildren:() => import('src/app/screens/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path:'store',
    loadChildren:() => import('src/app/screens/store/store.module').then(m => m.StoreModule)
  },
  {
    path:'activities',
    loadChildren:() => import('src/app/screens/activities/activities.module').then(m => m.ActivitiesModule)
  },
  {
    path:'activity/:id',
    loadChildren:() => import('src/app/screens/activity-details/activity-details.module').then(m => m.ActivityDetailsModule)
  },
  {
    path:'interests/:id',
    loadChildren:() => import('src/app/screens/intersts/intersts.module').then(m => m.InterstsModule)
  },
  {
    path:'clup/:id',
    loadChildren:() => import('src/app/screens/clup-details/clup-details.module').then(m => m.ClupDetailsModule)
  },
  {
    path:'search/:str',
    loadChildren:() => import('src/app/screens/search-result/search-result.module').then(m => m.SearchResultModule)
  },
  {
    path:'profile',
    loadChildren:() => import('src/app/screens/profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path:'members',
    loadChildren:() => import('src/app/screens/members/members.module').then(m => m.MembersModule)
  },
  {
    path:'notifications',
    loadChildren:() => import('src/app/screens/notifications/notifications.module').then(m => m.NotificationsModule)
  },
  {
    path:'**',
    component:NotfoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    scrollPositionRestoration: 'enabled',
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminConsoleComponent } from './component/admin-console/admin-console.component';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { TaskComponent } from './component/task/task.component';
import { UpgradeComponent } from './component/upgrade/upgrade.component';
import { UserComponent } from './component/user/user.component';
import { AuthGuard } from './shared/auth.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate:[AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate:[AuthGuard] },
  { path: 'user/:username', component: UserComponent, canActivate:[AuthGuard] },
  { 
    path: 'user/:username/upgrade', 
    component: UpgradeComponent, 
    canActivate:[AuthGuard], 
    loadChildren: () => import('./component/upgrade/upgrade.module').then(m => m.UpgradeModule), 
  },
  { 
    path: 'user/:username/task', 
    component: TaskComponent, 
    loadChildren: () => import('./component/task/task.module').then(m => m.TaskModule), 
    canActivate:[AuthGuard],
    data: { claimType: "canAccessTask" }, 
  },
  { path: 'user/admin/admin-console', component: AdminConsoleComponent, canActivate:[AuthGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

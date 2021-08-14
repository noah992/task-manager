import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { UserListComponent } from './user-list/user-list.component';
import { LoginComponent } from './login/login.component';
import { AdminConsoleComponent } from './admin-console/admin-console.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserComponent } from './user/user.component';
import { LoremComponent } from './lorem/lorem.component';
import { MatTabsModule } from '@angular/material/tabs';
import { HttpClientModule } from '@angular/common/http';
import { UpgradeComponent } from './upgrade/upgrade.component';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    HomeComponent,
    UserListComponent,
    LoginComponent,
    AdminConsoleComponent,
    UserComponent,
    LoremComponent,
    UpgradeComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    HttpClientModule,
  ],
  exports: [
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
  ],
})
export class ComponentModule { }

import { HeaderComponent } from './controller/layouts/header/header.component';
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FooterComponent } from './controller/layouts/footer/footer.component';
import { IndexComponent } from './controller/index/index.component';
import { SecondMenuComponent } from './controller/layouts/second-menu/second-menu.component';
import { BlogComponent } from './controller/blog/blog.component';
import { SponsorsComponent } from './controller/sponsors/sponsors.component';
import { ContactusComponent } from './controller/contactus/contactus.component';
import { EventaddComponent } from './controller/eventadd/eventadd.component';
import { EventComponent } from './controller/event/event.component';
import { ProfileComponent } from './controller/profile/profile.component';
import { GroupsComponent } from './controller/groups/groups.component';
import { OrganizationComponent } from './controller/organization/organization.component';
import { ChangepasswordComponent } from './controller/changepassword/changepassword.component';
import { NotificationSettingComponent } from './controller/notification-setting/notification-setting.component';
import { EditProfileComponent } from './controller/edit-profile/edit-profile.component';
import { OrganizationAddComponent } from './controller/organization-add/organization-add.component';
import { TermConditionComponent } from './controller/term-condition/term-condition.component';
import { EventDetailComponent } from './controller/event-detail/event-detail.component';
import { BlogDetailComponent } from './controller/blog-detail/blog-detail.component';
import { MyOrganizationsComponent } from './controller/my-organizations/my-organizations.component';
import { OrganizationEditComponent } from './controller/organization-edit/organization-edit.component';
import { MyVenuesComponent } from './controller/my-venues/my-venues.component';
import { VenuesAddComponent } from './controller/venues-add/venues-add.component';
import { VenuesEditComponent } from './controller/venues-edit/venues-edit.component';
import { VenueComponent } from './controller/venue/venue.component';
import { ForgetPasswordComponent } from './controller/forget-password/forget-password.component';
import { ResetPasswordComponent } from './controller/reset-password/reset-password.component';
import { MyEventsComponent } from './controller/my-events/my-events.component';
import { EventEditComponent } from './controller/event-edit/event-edit.component';
import { SearchComponent } from './controller/search/search.component';
import { ActivateNowComponent } from './controller/activate-now/activate-now.component';
import { MyAttendanceComponent } from './controller/my-attendance/my-attendance.component';
import { NotFoundComponent } from './not-found/not-found.component';














export const routes: Routes = [
      {path:'',component: IndexComponent,pathMatch: 'full',data: {meta: {title: 'Geekmeet',description: 'To help technologists succeed as thinkers, strategists, communicators and leaders of the future.'}}},
      {path:'header' ,component: HeaderComponent},
      {path:'footer' ,component: FooterComponent},
      {path:'blog' ,component: BlogComponent,data:{meta: {title: 'Blog | GeekMeet',description: 'Read great content from around the technology industry specifally curated for the technology professional.'}}},
      {path:'blog/:category' ,component: BlogComponent,data:{meta: {title: 'Blog | GeekMeet',description: 'Read great content from around the technology industry specifally curated for the technology professional.'}}},
      {path:'sponsors' ,component: SponsorsComponent},
      {path:'contactus' ,component: ContactusComponent},
      {path:'index' ,pathMatch: 'full',component: IndexComponent,data: {meta: {title: 'Geekmeet',description: 'To help technologists succeed as thinkers, strategists, communicators and leaders of the future.'}}},
      {path:'event/:menu' ,component: EventComponent,data:{meta: {title: 'Events | Geekmeet',description: 'Global Event Details',menu:true}}},
      {path:'my-events' ,component: MyEventsComponent,data:{meta: {title: 'My Events | Geekmeet',description: 'User Created Event informations'}}},
      {path:'profile' ,component: ProfileComponent,data: {meta: {title: 'User Profile',description: 'Description of the User Information'}}},
      {path:'groups' ,component: GroupsComponent},
      {path:'organization/:id' ,component: OrganizationComponent,data: [{id: true}]},
      {path:'changepassword' ,component: ChangepasswordComponent},
      {path:'notification-setting' ,component: NotificationSettingComponent},
      {path:'edit-profile' ,component: EditProfileComponent,data:{meta:{title:'User Prifile Edit | Geekmeet'}}},
      {path:'organization-add' ,component: OrganizationAddComponent},
      {path:'term-condition' ,component: TermConditionComponent},
      {path:'event-detail/:id' ,component: EventDetailComponent,data: [{id: true}]},
      {path:'blog-detail/:id' , component: BlogDetailComponent,data: [{id: true}]},
      {path:'my-organizations' ,component: MyOrganizationsComponent},
      {path:'organization-edit/:id' ,component: OrganizationEditComponent,data: [{id: true}]},
      {path:'my-venues' ,component: MyVenuesComponent},
      {path:'venues-add' ,component: VenuesAddComponent},
      {path:'venues-edit/:id' ,component: VenuesEditComponent,data: [{id: true}]},
      {path:'venue/:id' ,component: VenueComponent,data: [{id: true}]},
      {path:'forget-password' ,component: ForgetPasswordComponent},
      {path:'reset-password/:id' ,component: ResetPasswordComponent,data: [{id: true}]},
      {path:'event-edit/:id' ,component: EventEditComponent,data: [{id: true}]},
      {path:'search/:id' ,component: SearchComponent,data: [{id: true}]},
      {path:'activate-now/:id/:token' ,component: ActivateNowComponent,data: [{id: true, token: true}]},
      {path:'my-attendance' ,component: MyAttendanceComponent,data:{meta: {title: 'My Attendance | Geekmeet',description: 'User Attempt Event informations'}}},
      {path:'404' ,component: NotFoundComponent},
      // {path: '**', redirectTo: '/404'}
      // { path: '#', redirectTo: '' }

];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
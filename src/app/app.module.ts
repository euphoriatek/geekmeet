import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { RouterModule }   from '@angular/router';
import { ApiMethodService } from './model/api-method.service';
import { RecaptchaModule } from 'ng2-recaptcha';
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { RatingModule } from "ng2-rating";
import { SelectModule } from 'ng2-select/ng2-select';
import { MyDatePickerModule } from 'mydatepicker';
import { ImageUploadModule } from 'ng2-imageupload';
import {CKEditorModule} from 'ng2-ckeditor';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import {ToastyModule} from 'ng2-toasty';
import { AgmCoreModule } from 'angular2-google-maps/core';
//import { NouisliderModule } from 'ng2-nouislider';
import { LoadingAnimateModule, LoadingAnimateService } from 'ng2-loading-animate';
import {Ng2PaginationModule} from 'ng2-pagination';
// import { Ng2CompleterModule } from "ng2-completer";
import { Typeahead } from 'ng2-typeahead';
import { MetaModule } from 'ng2-meta';
import { AppComponent } from './app.component';
import { HeaderComponent } from './controller/layouts/header/header.component';
import { routing } from './app.routes';
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
import { EventListComponent } from './controller/event/eventlist.component';
import { VenueaddComponent } from './controller/eventadd/venueadd.component';
import { MyOrganizationsComponent } from './controller/my-organizations/my-organizations.component';
import { OrganizationEditComponent } from './controller/organization-edit/organization-edit.component';
import { DeleteModelComponent } from './controller/delete-model/delete-model.component';
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







@NgModule({
  declarations: [
  AppComponent,
  Typeahead,
  HeaderComponent,
  FooterComponent,
  IndexComponent,
  SecondMenuComponent,
  BlogComponent,
  SponsorsComponent,
  ContactusComponent,
  EventaddComponent,
  EventComponent,
  ProfileComponent,
  GroupsComponent,
  OrganizationComponent,
  ChangepasswordComponent,
  NotificationSettingComponent,
  EditProfileComponent,
  OrganizationAddComponent,
  TermConditionComponent,
  EventDetailComponent,
  BlogDetailComponent,
  EventListComponent,
  MyOrganizationsComponent,
  OrganizationEditComponent,
  DeleteModelComponent,
  MyVenuesComponent,
  VenuesAddComponent,
  VenuesEditComponent,
  VenueComponent,
  ForgetPasswordComponent,
  ResetPasswordComponent,
  MyEventsComponent,
  EventEditComponent,
  SearchComponent,
  ActivateNowComponent,
  VenueaddComponent,
  MyAttendanceComponent,
  NotFoundComponent,


  ],
  imports: [
  BrowserModule,
  FormsModule,    
  routing,
  HttpModule,
  //NouisliderModule,
  RatingModule,
  SelectModule,
  MyDatePickerModule,
  ImageUploadModule,
  CKEditorModule,
  Ng2Bs3ModalModule,
  Ng2PaginationModule,
  LoadingAnimateModule.forRoot(),
  MetaModule.forRoot(),
  AgmCoreModule.forRoot({
    apiKey: 'AIzaSyD-BvDe_7N5-LpgFlXgfkv44Gdez1qL7-w'
  }),
  ToastyModule.forRoot(),
  RecaptchaModule.forRoot(),
  ModalModule.forRoot(),
  BootstrapModalModule,
  RouterModule.forRoot([
    {path:'',component: IndexComponent,pathMatch: 'full' },
    {path:'header' ,component: HeaderComponent},
    {path:'footer' ,component: FooterComponent},
    {path:'blog' ,pathMatch: 'full',component: BlogComponent},
    {path:'sponsors' ,component: SponsorsComponent},
    {path:'contactus' ,component: ContactusComponent},
    {path:'eventadd' ,pathMatch: 'full',component: EventaddComponent},
    {path:'index' ,pathMatch: 'full',component: IndexComponent},
    {path:'event' ,component: EventComponent},
    {path:'profile' ,component: ProfileComponent},
    {path:'groups' ,component: GroupsComponent},
    {path:'organization' ,component: OrganizationComponent},
    {path:'changepassword' ,component: ChangepasswordComponent},
    {path:'notification-setting' ,component: NotificationSettingComponent},
    {path:'edit-profile' ,pathMatch: 'full',component: EditProfileComponent},
    {path:'organization-add' ,component: OrganizationAddComponent},
    {path:'term-condition' ,component: TermConditionComponent},
    {path:'event-detail' ,component: EventDetailComponent},
    {path:'blog-detail' ,component: BlogDetailComponent},
    {path:'my-organizations' ,component: MyOrganizationsComponent},
    {path:'my-venues' ,component: MyVenuesComponent},
    {path:'venues-add' ,component: VenuesAddComponent},
    {path:'venues-edit' ,component: VenuesEditComponent},
    {path:'organization-edit' ,component: OrganizationEditComponent},
    {path:'venue' ,component: VenueComponent},
    {path:'forget-password' ,component: ForgetPasswordComponent},
    {path:'reset-password' ,component: ResetPasswordComponent},
    {path:'my-events' ,component: MyEventsComponent},
    {path:'event-edit' ,component: EventEditComponent},
    {path:'activate-now' ,component: ActivateNowComponent},
    {path:'my-attendance' ,component: MyAttendanceComponent},
    {path:'404' ,component: NotFoundComponent},
    {path: '**', redirectTo: '/404'}
    ])
  ],
  providers: [ApiMethodService,LoadingAnimateService],
  bootstrap: [AppComponent]
})
export class AppModule { }

//{useHash: true}

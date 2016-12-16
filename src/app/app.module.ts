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
import { NouisliderModule } from 'ng2-nouislider';




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
import { MyOrganizationsComponent } from './controller/my-organizations/my-organizations.component';
import { OrganizationEditComponent } from './controller/organization-edit/organization-edit.component';
import { DeleteModelComponent } from './controller/delete-model/delete-model.component';
import { MyVenuesComponent } from './controller/my-venues/my-venues.component';
import { VenuesAddComponent } from './controller/venues-add/venues-add.component';
import { VenuesEditComponent } from './controller/venues-edit/venues-edit.component';
import { VenueComponent } from './controller/venue/venue.component';
import { ForgetPasswordComponent } from './controller/forget-password/forget-password.component';








@NgModule({
  declarations: [
    AppComponent,
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

    

  ],
  imports: [
    BrowserModule,
    FormsModule,    
    routing,
    HttpModule,
    NouisliderModule,
    RatingModule,
    SelectModule,
    MyDatePickerModule,
    ImageUploadModule,
    CKEditorModule,
    Ng2Bs3ModalModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCbrPyDsleOvqZk84KT6YtzYcow7Nz-o_4'
    }),
    ToastyModule.forRoot(),
    RecaptchaModule.forRoot(),
    ModalModule.forRoot(),
    BootstrapModalModule,
    RouterModule.forRoot([
      {path:'header' ,component: HeaderComponent},
      {path:'footer' ,component: FooterComponent},
      {path:'blog' ,component: BlogComponent},
      {path:'sponsors' ,component: SponsorsComponent},
      {path:'contactus' ,component: ContactusComponent},
      {path:'eventadd' ,component: EventaddComponent},
      {path:'index' ,component: IndexComponent},
      {path:'event' ,component: EventComponent},
      {path:'profile' ,component: ProfileComponent},
      {path:'groups' ,component: GroupsComponent},
      {path:'organization' ,component: OrganizationComponent},
      {path:'changepassword' ,component: ChangepasswordComponent},
      {path:'notification-setting' ,component: NotificationSettingComponent},
      {path:'edit_profile' ,component: EditProfileComponent},
      {path:'organization-add' ,component: OrganizationAddComponent},
      {path:'term-condition' ,component: TermConditionComponent},
      {path:'event_detail' ,component: EventDetailComponent},
      {path:'blog_detail' ,component: BlogDetailComponent},
      {path:'my-organizations' ,component: MyOrganizationsComponent},
      {path:'my-venues' ,component: MyVenuesComponent},
      {path:'venues-add' ,component: VenuesAddComponent},
      {path:'venues-edit' ,component: VenuesEditComponent},
	    {path:'organization-edit' ,component: OrganizationEditComponent},
      {path:'venue' ,component: VenueComponent},
      {path:'forget-password' ,component: ForgetPasswordComponent},
      {path:'' ,component: IndexComponent},
      ])
  ],
  providers: [ApiMethodService],
  bootstrap: [AppComponent]
})
export class AppModule { }

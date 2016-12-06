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














export const routes: Routes = [
      {path:'header' ,component: HeaderComponent},
      {path:'footer' ,component: FooterComponent},
      {path:'blog' ,component: BlogComponent},
      {path:'sponsors' ,component: SponsorsComponent},
      {path:'contactus' ,component: ContactusComponent},
      {path:'index' ,component: IndexComponent},
      {path:'event/:menu' ,component: EventComponent,data:[{menu:true}]},
      // {path:'event' ,component: EventComponent},
      {path:'profile' ,component: ProfileComponent},
      {path:'groups' ,component: GroupsComponent},
      {path:'organization' ,component: OrganizationComponent},
      {path:'changepassword' ,component: ChangepasswordComponent},
      {path:'notification-setting' ,component: NotificationSettingComponent},
      {path:'edit_profile' ,component: EditProfileComponent},
      {path:'organization-add' ,component: OrganizationAddComponent},
      {path:'term-condition' ,component: TermConditionComponent},
      {path:'event_detail/:id' ,component: EventDetailComponent,data: [{id: true}]},
      {path:'event_details/:id' ,component: EventDetailComponent,data: [{id: true}]},
      {path:'blog_detail/:id' ,component: BlogDetailComponent,data: [{id: true}]},
      {path:'' ,component: IndexComponent}

];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
import { Component, OnInit, AfterViewInit,ViewChild } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

declare var jQuery: any;
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'delete-model',
  templateUrl: '../../view/delete-model/delete-model.component.html',
  styleUrls: ['../../assets/css/delete-model/delete-model.component.css']
})
export class DeleteModelComponent{

    @ViewChild('#modal_id')
    modal: ModalComponent;

    close() {
        this.modal.close();
    }

    open() {
        this.modal.open();
    }

  delete(type,id){
   console.log(type);
   console.log(id);

  }

}

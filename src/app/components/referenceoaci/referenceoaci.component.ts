import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Referenceoaci } from 'src/app/class/referenceOaci';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-referenceoaci',
  templateUrl: './referenceoaci.component.html',
  styleUrls: ['./referenceoaci.component.scss']
})
export class ReferenceoaciComponent {
  selectedReference:any[]=[];
  references:any[]=[];
  reference:Referenceoaci = new Referenceoaci();
  referenceDialog = false;
  submitted = false;

  constructor( private confirmationService: ConfirmationService,
    private messageService: MessageService,private api:ApiService, public translate: TranslateService){}

    ngOnInit(){
      this.listReference();
    }
    openNew(){
      this.referenceDialog = true;
    }
  
    listReference(){
      this.references = [];
      this.api.getAllReference().subscribe((res: any) => {
        this.references = res;
        console.log(this.references);
      });
    }

    
  deleteSelecteddomaine(){
    this.confirmationService.confirm({
      message:
        'Êtes-vous certain de vouloir supprimer les notations selectionés ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
       
    this.api
          .deleteReferenceList(this.selectedReference)
          .subscribe((res) => {
            this.listReference();
          }); 
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Produits supprimés avec succès',
          life: 3000,
        });
      },
    });
  }

  editPep(reference:Referenceoaci){
    this.reference = { ...reference };
    this.referenceDialog = true;
  }

  delete(reference:Referenceoaci){
    this.confirmationService.confirm({
      message: 'Êtes-vous certain de vouloir ' + reference.code + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.api.deleteReference(reference.referenceoaciID).subscribe((res) => {
          this.reference = new Referenceoaci();
          console.log(reference.referenceoaciID);
          this.listReference();
         });  
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Domaine supprimée avec succès',
            life: 3000,
          });
      },
    });
  }

  hideDialog(){
    this.referenceDialog = false;
    this.submitted = true;
  }

  savePermis(){
    console.log(this.reference);
     this.api.insertReference(this.reference).subscribe((data) => {
      console.log(data);
      this.listReference();
    }); 
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Notation ajouté avec succès',
      life: 3000,
    });
   
    this.referenceDialog = false;
  }
  
}

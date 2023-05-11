import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Domaine } from 'src/app/class/domaineAudit';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-domaine',
  templateUrl: './domaine.component.html',
  styleUrls: ['./domaine.component.scss']
})
export class DomaineComponent {
  selectedDomaine:any[]=[];
  domaines:any[]=[];

  domaine:Domaine = new Domaine();

  domaineDialog = false;
  submitted = false;
  

  constructor( private confirmationService: ConfirmationService,
    private messageService: MessageService,private api:ApiService){}

  ngOnInit(){
   this.listDomaine();
  }
  openNew(){
    this.domaineDialog = true;
  }

  listDomaine(){
    this.domaines = [];
    this.api.getAllDomaine().subscribe((res: any) => {
      this.domaines = res;
      console.log(this.domaines);
    }); 
  }

  deleteSelecteddomaine(){
    this.confirmationService.confirm({
      message:
        'Êtes-vous certain de vouloir supprimer les domaines selectionés ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
       
    /*     this.api
          .deletePepiniereList(this.selectedDomaine)
          .subscribe((res) => {
            this.listDomaine();
          }); */
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Produits supprimés avec succès',
          life: 3000,
        });
      },
    });
  }

  editPep(domaine:Domaine){
    this.domaine = { ...domaine };
    this.domaineDialog = true;
  }

  delete(domaine:Domaine){
    this.confirmationService.confirm({
      message: 'Êtes-vous certain de vouloir supprimer' + domaine.libelle + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
         this.api.deleteDomaine(domaine.domaineID).subscribe((res) => {
          this.domaine = new Domaine(); 
          this.listDomaine( );
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
    this.domaineDialog = false;
    this.submitted = true;
  }

  savePermis(){
    console.log(this.domaine);
     this.api.insertDomaine(this.domaine).subscribe((data) => {
      console.log(data);
      this.listDomaine();
      this.domaineDialog = false;
    }); 
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Produits ajouté avec succès',
      life: 3000,
    });
  
  }
}

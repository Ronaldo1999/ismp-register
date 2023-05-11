import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ElementCrutial } from 'src/app/class/elementCrutial';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-elementcrutial',
  templateUrl: './elementcrutial.component.html',
  styleUrls: ['./elementcrutial.component.scss']
})
export class ElementcrutialComponent {
  selectedelements:any[]=[];
  elements:any[]=[];

  element:ElementCrutial = new ElementCrutial();

  elementDialog = false;
  submitted = false;
  

  constructor( private confirmationService: ConfirmationService,
    private messageService: MessageService,private api:ApiService){}

  
  ngOnInit(){
    this.listElements();
  }
  openNew(){
    this.elementDialog = true;
  }

  listElements(){
    this.elements = [];
     this.api.getAllElement().subscribe((res: any) => {
      this.elements = res;
      console.log(this.elements);
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
          .deletePepiniereList(this.selectedelements)
          .subscribe((res) => {
            this.listElements();
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

  editPep(element:ElementCrutial){
    this.element = { ...element };
    this.elementDialog = true;
  }

  delete(element:ElementCrutial){
    this.confirmationService.confirm({
      message: 'Êtes-vous certain de vouloir supprimer' + element.titre + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(element);
        
         this.api.deleteElement(element.elementCrutialID).subscribe((res) => {
          this.element = new ElementCrutial(); 
          this.listElements( );
          console.log(element.elementCrutialID);
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
    this.elementDialog = false;
    this.submitted = true;
  }

  savePermis(){
    console.log(this.element);
    this.api.insertElement(this.element).subscribe((data) => {
      console.log(data);
      this.listElements();
      this.elementDialog = false;
    }); 
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Produits ajouté avec succès',
      life: 3000,
    });
    
  }
}


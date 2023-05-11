import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Notation } from 'src/app/class/notation';
import { ApiService } from 'src/app/services/api.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-notation',
  templateUrl: './notation.component.html',
  styleUrls: ['./notation.component.scss']
})
export class NotationComponent {
  selectedNotation:any[]=[];
  notations:any[]=[];

  notation:Notation = new Notation();

  notationDialog = false;
  submitted = false;
  
  constructor( private confirmationService: ConfirmationService,
    private messageService: MessageService,private api:ApiService, public translate: TranslateService){}

  ngOnInit(){ this.listNotations();}
  openNew(){
    this.notationDialog = true;
  }

  listNotations(){
    this.notations = [];
    this.api.getAllNotation().subscribe((res: any) => {
      this.notations = res;
      console.log(this.notations);
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
          .deleteNotationList(this.selectedNotation)
          .subscribe((res) => {
            this.listNotations();
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

  editPep(notation:Notation){
    this.notation = { ...notation };
    this.notationDialog = true;
  }

  delete(notation:Notation){
    this.confirmationService.confirm({
      message: 'Êtes-vous certain de vouloir ' + notation.libelle + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
         this.api.deleteNotation(notation.noteID).subscribe((res) => {
          this.notation = new Notation();
          console.log(notation.noteID);
          this.listNotations();
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
    this.notationDialog = false;
    this.submitted = true;
  }

  savePermis(){
    console.log(this.notation);
     this.api.insertNotation(this.notation).subscribe((data) => {
      console.log(data);
      this.listNotations();
    }); 
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Notation ajouté avec succès',
      life: 3000,
    });
   
    this.notationDialog = false;
  }
}

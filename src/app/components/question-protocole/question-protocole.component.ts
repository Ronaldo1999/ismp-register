import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { Observable, catchError, of } from 'rxjs';
import { Domaine } from 'src/app/class/domaineAudit';
import { ElementCrutial } from 'src/app/class/elementCrutial';
import { FindParam } from 'src/app/class/find-param';
import { QuestionProtocole } from 'src/app/class/questionProtocole';
import { Referenceoaci } from 'src/app/class/referenceOaci';
import { ApiService } from 'src/app/services/api.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { lastValueFrom } from 'rxjs';
import { mergeAll } from 'rxjs/operators';




@Component({
  selector: 'app-question-protocole',
  templateUrl: './question-protocole.component.html',
  styleUrls: ['./question-protocole.component.scss']
})


export class QuestionProtocoleComponent {

  references: Referenceoaci[] = []
  elements: ElementCrutial[] = []
  domaines: Domaine[] = []
  questionsAll: QuestionProtocole[] = []
  questions: QuestionProtocole[] = []
  question = new QuestionProtocole();

  loading = false
  fparam: any
  displaySpinner: boolean = false;
  displaySucces: boolean = false;
  displayError: boolean = false;
  displayDialog: boolean = false;

  successMessage = 'Success'
  errorMessage = 'error'
  selectedColonnes: string[] = []
  arbrePQ: TreeNode[] = [];
  arbre: TreeNode[] = [];
  arbreDomaines: TreeNode[] = [];
  selectedDomaines: any[] = [];
  selectedNodes: TreeNode[] = []; selectedElement!: any; selectedNode!: TreeNode;
  select = false
  selectID !: string

  col = [{ field: 'numero', header: 'N°' }, { field: 'sigle', header: 'Sigle' },
  { field: 'libelle', header: 'Designation' }, { field: 'dateNotation', header: 'Date Notation' }, { field: 'code', header: 'Action' }]


  constructor(private confirmationService: ConfirmationService, private messageService: MessageService, private api: ApiService,
    private tokenStorageService: SessionStorageService, public translate: TranslateService) {
    this.fparam = new FindParam(this.tokenStorageService.getOrganisation(), this.tokenStorageService.getUser().username)
  }


  ngOnInit(): void { this.referenceList(); this.pqList2(); this.domaineList(); this.elementCrutialList(); }

  rechercher() { }

  pqList2() {
    this.api.pqList(this.fparam).pipe(
      catchError(error => {
        console.log(error);
        return of([]);
      })
    ).subscribe((data: any) => {
      this.questionsAll = data; console.log(data);
    });
  }
  // pqList() { 
  //   this.api.pqList().pipe(
  //     catchError(error => {
  //       console.log(error);
  //       return of([]);
  //     })
  //   ).subscribe((data: any) => {
  //     this.questions = data;
  //   });
  // }

  referenceList() {
    this.api.getAllReference().subscribe({
      next: (data: any) => { this.references = data; console.log(data); },
      error: (error: any) => { console.error(error); },
      complete: () => { console.info('complete'); }
    });
  }

  // domaineList() {
  //   this.api.getAllDomaine().subscribe({
  //     next: (data: any) => { this.domaines = data; console.log(data); },
  //     error: (error: any) => { console.error(error); },
  //     complete: () => { console.info('complete'); }
  //   });
  // }

  elementCrutialList() {
    this.api.getAllElement().subscribe({
      next: (data: any) => { this.elements = data; console.log(data); },
      error: (error: any) => { console.error(error); },
      complete: () => { console.info('complete'); }
    });
  }

  async pqList(id: string) {
    this.arbrePQ = []; this.fparam.domaineID = id;
    let rs = await this.api.pqList(this.fparam).toPromise();

    if (Array.isArray(rs)) {
      for await (const item2 of rs) {
        let op: TreeNode = { key: "", data: null, type: "", parent: undefined };
        op.key = item2.questionProtocoleID; op.data = item2; op.parent = item2.domaineID; this.arbrePQ.push(op);
      }
    } else {
      console.log("L'observable ne renvoie pas un tableau.");
    }

    return this.arbrePQ;
  }




  showDialogSucces(message: string) { this.successMessage = message; this.displaySucces = true; }
  closeSucces() { this.displaySucces = false; }

  showDialogError(message: string) { this.errorMessage = message; this.displayError = true; }
  closeError() { this.displayError = false; }

  // tableauReport() {
  //   this.displaySpinner = true;
  //   this.cgApi.tableauAnnuelReport(this.fparam).subscribe((response: BlobPart) => {
  //     const file = new Blob([response], { type: 'application/pdf' });
  //     const fileURL = URL.createObjectURL(file);
  //     print({ printable: fileURL, showModal: true });
  //     this.displaySpinner = false;
  //   });
  // }



  pqInsert() {
    this.api.pqInsert(this.question).subscribe({
      next: (data: any) => {
        console.log(data); this.closeDialog(); this.domaineList(); this.pqList2();
      },
      error: (error: any) => {
        console.error(error);
      },
      complete: () => {
        console.info('complete'); this.closeDialog(); this.domaineList(); this.pqList2();
      }
    }); 
  }

  openDialog() { this.displayDialog = true }
  closeDialog() { this.displayDialog = false }


  pqEdit(pq: QuestionProtocole) {
    this.question = { ...pq };
    this.displayDialog = true;
  }

  pqDelete(notation: QuestionProtocole) {
    this.confirmationService.confirm({
      message: 'Êtes-vous certain de vouloir supprimer cet element ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.pqDelete(notation.questionProtocoleID).subscribe((res) => {
          this.question = new QuestionProtocole();
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Domaine supprimée avec succès',
            life: 3000,
          });
          this.domaineList();
        });
      }
    });
  }


  /**Liste des activites sans phases*/
  domaineList() {
    this.domaines = [];
    var arrayToTree = require('array-to-tree');
    this.api.getAllDomaine().subscribe(async (data: any) => {
      this.domaines = data; console.log(data);
      for (let item of data) {
        let file: TreeNode = { key: "", label: 'domaine', data: null, parent: undefined, children: [] }
        file.label = item.numero + ' - ' + item.libelle;
        file.key = item.domaineID; file.data = item; file.parent = item.domaineParentID; 
        if (item.domaineParentID) { file.children = [{ data: {} }]; } this.arbre.push(file); this.arbreDomaines.push(file);

      }
      // convertir le tableau de treeNode en arbre
      this.arbre = arrayToTree(this.arbre, { parentProperty: 'parent', customID: 'key' });
      this.arbreDomaines = arrayToTree(this.arbreDomaines, { parentProperty: 'parent', customID: 'key' });
    });
  }



  nodeSelect(event: any) {
    this.select = true;
    this.selectID = event.node.data.activiteID;
    this.selectedElement = event.node.data;
  }
  nodeUnselect(event: any) { this.select = false; }

  /** evenement apres expand */
  async onNodeExpand(event: any) {
    const node = event.node; console.log(event);

    if (node.data.domaineParentID) {
      node.children = await this.pqList(node.data.domaineID); this.arbre = [...this.arbre];
      console.log(node.children);
}

  }


  defineLibelle(obj: any): string {
    if (obj.questionProtocoleID) {
      return obj.titre;
    } else {
      return obj.libelle;
    }
  }

  expandAll() { this.arbre.forEach(node => { this.expandRecursive(node, true); }); this.arbre = [...this.arbre]; }
  private expandRecursive(node: TreeNode, isExpand: boolean) {
    if (node.data?.niveauActiviteID < 4) { node.expanded = isExpand; }
    if (node.children) { node.children.forEach(childNode => { this.expandRecursive(childNode, isExpand); }); };
  }
}
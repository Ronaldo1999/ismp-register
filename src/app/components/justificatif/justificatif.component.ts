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
import { ResponseFile } from 'src/app/class/response-file'; import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Justificatif } from 'src/app/class/justificatif';

@Component({
  selector: 'app-justificatif',
  templateUrl: './justificatif.component.html',
  styleUrls: ['./justificatif.component.scss']
})
export class JustificatifComponent {
justificatifs : Justificatif[]=[]
  references: Referenceoaci[] = []
  elements: ElementCrutial[] = []
  domaines: Domaine[] = []
  questions: QuestionProtocole[] = []
  question = new QuestionProtocole();
  justificatif= new Justificatif();
  fichiers: File[] = [];
  loading = false
  fparam: any
  displaySpinner: boolean = false;
  displaySucces: boolean = false;
  displayError: boolean = false;
  displayDialog: boolean = false;
  displayadd: boolean = false;

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
  modIndex!: number

  col = [{ field: 'numero', header: 'N°' }, { field: 'sigle', header: 'Sigle' },
  { field: 'libelle', header: 'Designation' }, { field: 'dateNotation', header: 'Date Notation' }, { field: 'code', header: 'Action' }]


  constructor(private confirmationService: ConfirmationService, private messageService: MessageService, private api: ApiService,
    private tokenStorageService: SessionStorageService, public translate: TranslateService) {
    this.fparam = new FindParam(this.tokenStorageService.getOrganisation(), this.tokenStorageService.getUser().username)
  }


  ngOnInit(): void { this.referenceList();this.domaineList(); this.pqList(); this.elementCrutialList(); }

  rechercher() { }





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

  justificatifList(id : string) {
    this.api.justificatifListBy(id).subscribe({
      next: (data: any) => { this.justificatifs = data; console.log(data); },
      error: (error: any) => { console.error(error); },
      complete: () => { console.info('complete'); }
    });
  }

  elementCrutialList() {
    this.api.getAllElement().subscribe({
      next: (data: any) => { this.elements = data; console.log(data); },
      error: (error: any) => { console.error(error); },
      complete: () => { console.info('complete'); }
    });
  }

  domaineList() {
    this.api.getAllDomaine().subscribe({
      next: (data: any) => { this.domaines = data; console.log(data); },
      error: (error: any) => { console.error(error); },
      complete: () => { console.info('complete'); }
    });
  }

  pqList() {
    this.api.pqList(this.fparam).pipe(
      catchError(error => {
        console.log(error);
        return of([]);
      })
    ).subscribe((data: any) => {
      this.questions = data; console.log(data);
    });
  }

  




  showDialogSucces(message: string) { this.successMessage = message; this.displaySucces = true; }
  closeSucces() { this.displaySucces = false; }

  showDialogError(message: string) { this.errorMessage = message; this.displayError = true; }
  closeError() { this.displayError = false; }

  pqInsert() {
    this.api.pqInsert(this.question).subscribe({
      next: (data: any) => {
        console.log(data); this.closeDialog(); this.pqList();
      },
      error: (error: any) => {
        console.error(error);
      },
      complete: () => {
        console.info('complete'); this.closeDialog(); this.pqList();
      }
    });
  }

  justificatifInsert() {
    this.justificatif.fichierID = this.files.map(a => a.id);
    this.api.justificatifInsert(this.justificatif).subscribe({
      next: (data: any) => { console.log(data); this.closeAdd(); },
      error: (error: any) => { console.error(error); },
      complete: () => { console.info('complete'); this.closeAdd(); }
    });
  }
 

  openDialog() { this.displayDialog = true; }
  closeDialog() { this.displayDialog = false; this.justificatif = new Justificatif()}


  openAdd(just?: Justificatif, i?: number) { 
    this.displayadd = true ;
    if (just) { this.justificatif = just; this.modIndex = i ? i : 0; this.listByJustif(just.justificatifID); }
    else { this.justificatif.questionProtocoleID = this.question.questionProtocoleID; }
  }
  
  closeAdd() { this.justificatifList(this.justificatif.questionProtocoleID);  this.displayadd = false }


  showReponse(pq: QuestionProtocole) {
    this.question = { ...pq }; this.justificatifList(pq.questionProtocoleID); 
    this.displayDialog = true;
  }

  justificatifDelete(just: Justificatif) {
    this.confirmationService.confirm({
      message: 'Êtes-vous certain de vouloir supprimer cet element ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.justificatifDelete(just.justificatifID).subscribe((res) => {
          this.question = new QuestionProtocole();
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Domaine supprimée avec succès',
            life: 3000,
          });
          this.justificatifList(just.questionProtocoleID);
        });
      }
    });
  }


  // /**Liste des activites sans phases*/
  // domaineList() {
  //   this.domaines = [];
  //   var arrayToTree = require('array-to-tree');
  //   this.api.getAllDomaine().subscribe(async (data: any) => {
  //     this.domaines = data; console.log(data);
  //     for (let item of data) {
  //       let file: TreeNode = { key: "", label: 'domaine', data: null, parent: undefined, children: [] }
  //       file.label = item.numero + ' - ' + item.libelle;
  //       file.key = item.domaineID; file.data = item; file.parent = item.domaineParentID;
  //       if (item.domaineParentID) { file.children = [{ data: {} }]; } this.arbre.push(file); this.arbreDomaines.push(file);

  //     }
  //     // convertir le tableau de treeNode en arbre
  //     this.arbre = arrayToTree(this.arbre, { parentProperty: 'parent', customID: 'key' });
  //     this.arbreDomaines = arrayToTree(this.arbreDomaines, { parentProperty: 'parent', customID: 'key' });
  //   });
  // }


  // async pqList(id: string) {
  //   this.arbrePQ = []; this.fparam.domaineID = id;
  //   let rs = await this.api.pqList(this.fparam).toPromise();

  //   if (Array.isArray(rs)) {
  //     for await (const item2 of rs) {
  //       let op: TreeNode = { key: "", data: null, type: "", parent: undefined };
  //       op.key = item2.questionProtocoleID; op.data = item2; op.parent = item2.domaineID; this.arbrePQ.push(op);
  //     }
  //   } else {
  //     console.log("L'observable ne renvoie pas un tableau.");
  //   }

  //   return this.arbrePQ;
  // }


  // nodeSelect(event: any) {
  //   this.select = true;
  //   this.selectID = event.node.data.activiteID;
  //   this.selectedElement = event.node.data;
  // }
  // nodeUnselect(event: any) { this.select = false; }

  // /** evenement apres expand */
  // async onNodeExpand(event: any) {
  //   const node = event.node; console.log(event);

  //   if (node.data.domaineParentID) {
  //     node.children = await this.pqList(node.data.domaineID); this.arbre = [...this.arbre];
  //     console.log(node.children);
  //   }

  // }


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

  selectedFiles?: FileList;
  

  currentFile?: File;
  fichiersMain: File[] = [];

  progress = 0;
  message = '';
  checked: boolean = false;
  noms: any[] = []
  index: number = -1
  fileInfos?: Observable<any>;
  fileInfosMain?: Observable<any>;
  files: ResponseFile[] = []
  filesMain: ResponseFile = new ResponseFile()
  filesCopy: ResponseFile[] = []
  filesCopyMain: ResponseFile[] = []

  url: any = ''
  display = false
  displayFile = false
  dialogMessage: string = ''
  imageBlobUrl: any | null = null;
  viewer: any = 'google';
  selectedType = 'docx';
  a: any

  retrievedImage: any;
  retrievedapplication: any;
  retrievedapplication1: any;
  retrievedFile: any;
  base64Data: any;
  retrieveResonse: any;
  displayMessage = false
  count = 0
  showspinner = false
  courrierID: string = ''
  spinerMessage = 'chargement'

  isModified = false
  isTemp = 0


  onUpload(event: any) {
    this.uploadDrag(event.files);
  }

  uploadDrag(selectedFiles: any): void {
    this.progress = 0;
    this.selectedFiles = selectedFiles;

    if (selectedFiles) {
      for (let index = 0; index < selectedFiles.length; index++) {
        const file: File | null = selectedFiles.item(index);
        if (file) {
          this.currentFile = file;

          this.api.upload(this.currentFile, this.tokenStorageService.getUser().username, 0).subscribe(
            (event: any) => {
              this.count++;
              if (event.type === HttpEventType.UploadProgress) {
                this.fileInfos = this.api.getTempFiles(); this.progress = Math.round(100 * event.loaded / event.total);
              } else if (event instanceof HttpResponse) {
            
                console.log(event); this.files.push(event.body); this.filesCopy.push(event.body);
                if (this.count == selectedFiles.length) { this.showspinner = false; this.count = 0; }
              }
            },
            (err: any) => {
              this.errorMessage = err.error;
              console.log(this.errorMessage);
              console.log(err.error);

              this.progress = 0;
              this.currentFile = undefined;
              this.displayError = true;
            });
        }
      }
      // this.selectedFiles = undefined;
    }
    this.fichiers = [...this.fichiers];
  }


  listByJustif(id: string) {
    this.displaySpinner = true;
    this.api.getFilesByJust(id).subscribe(data => {
      console.log(data);
      this.files = data;
      
    }); this.displaySpinner = false;
  }

  listFile() { this.api.getFiles().subscribe( data => { this.files = data } ) }




  uploadedFiles: any[] = [];
  onUpload2(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }


  telecharger(indicateurID: string) {
    this.displaySpinner = true;
    this.api.downloadFile(indicateurID).subscribe((response: Blob) => {
      const fileURL = URL.createObjectURL(response);
      window.open(fileURL);
      this.displaySpinner = false;
    });
  }


}
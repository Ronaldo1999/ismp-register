import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { FindParam } from 'src/app/class/find-param';
import { ApiService } from 'src/app/services/api.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { Cour } from 'src/app/class/cour/cour';
import { PeriodeAcademique } from 'src/app/class/periodeAcademique/periode-academique';
import { ParcourAcademique } from 'src/app/class/parcourAcademique/parcour-academique';
import { Promotion } from 'src/app/class/promotion/promotion';
import { Regroupement } from 'src/app/class/regroupement/regroupement';
import { DivisionCalendaire } from 'src/app/class/divisionCalendaire/division-calendaire';
import { Ue } from 'src/app/class/ue/ue';

import { Salle } from 'src/app/class/salle/salle';
import { formatDate } from '@angular/common';
import { Programme } from 'src/app/class/programme/programme';
import { Enseignant } from 'src/app/class/enseignant/enseignant';
import { User } from 'src/app/class/user/user';
import { Assiduite } from 'src/app/class/assiduite/assiduite';
@Component({
  selector: 'app-assiduite',
  templateUrl: './assiduite.component.html',
  styleUrls: ['./assiduite.component.scss']
})
export class AssiduiteComponent {

  fparam: any;

  programme = new Programme();

  cour = new Cour();
  seance = new Cour();
  courInitial = new Cour();
  cours: Cour[] = [];
  salles: Salle[] = [];

  auditeurs: Assiduite[] = [];

  periodeAcademiques: PeriodeAcademique[] = [];
  parcoursAcademiques: ParcourAcademique[] = [];
  promotions: Promotion[] = [];
  regroupements: Regroupement[] = [];
  divisionCalendaires: DivisionCalendaire[] = [];
  enseignants: Enseignant[] = [];
  enseignantSelected: Enseignant[] = [];
  uniteEnseignements: Ue[] = [];
  ue = new Ue();

  weekend = false;
  search = false;
  displayDialog = false;
  displayReportDialog = false;
  displayAnnulerDialog = false;
  displayError = false;
  displaySucces = false;
  chargement = false;
  chargementUe = false;
  displaySpinner = false;

  position = 'top'
  succesMessage = ''
  errorMessage = ''
  user = new User();





  liste: any[] = [];


  categorie = new Cour();

  dateTime: string = new Date().toLocaleString();


  constructor(private messageService: MessageService, private confirmationService: ConfirmationService,
    private tokenStorageService: SessionStorageService, public dialog: DialogService, public api: ApiService, public dialogService: DialogService,
    public translate: TranslateService, private router: Router) {
    this.fparam = new FindParam(this.tokenStorageService.getOrganisation(), this.tokenStorageService.getUser().username);
    this.user = this.tokenStorageService.getUser();

  }

  ngOnInit(): void { this.periodeAcademiqueList(); }


  rechercher() {
    if (this.courInitial.idparcours && this.courInitial.idregroupements && this.courInitial.idcp) {
      this.auditeurs = [];
      this.displaySpinner = true;
      this.api.auditeursListByCp(this.courInitial.idparcours, this.courInitial.idregroupements, this.courInitial.idcp).subscribe({
        next: (data: any) => {
          this.auditeurs = data;
          if (data.length > 0) {
            for (const ele of data) {
              if (ele.present) {
                this.selectedAuditeurs.push(ele);
              }
            }
          }
          console.log(data); this.displaySpinner = false;
        },
        error: (error: any) => { console.error(error); this.displaySpinner = false; },
        complete: () => { console.info('complete'); this.displaySpinner = false; }
      });
    }

  }

  selectedAuditeurs: Assiduite[] = [];

  setPressence(action: number, idauditeur?: number) {
    if (action && action == 1) {
      for (const ele of this.auditeurs) {
        if (ele.idauditeur == idauditeur) {
          ele.present = !ele.present;
          this.auditeurs = [... this.auditeurs];
        }
      }
    } else if (action == 2) {
      if (this.selectedAuditeurs.length) {
        for (const ele of this.auditeurs) {
          ele.present = !ele.present;
          this.auditeurs = [... this.auditeurs];
        }
      }
    }
  }
  saveSpinner = false;
  assiduiteInsert() {
    this.saveSpinner = true;
    console.log(this.auditeurs);
    this.api.assiduiteInsert(this.auditeurs).subscribe({
      next: (data: any) => { console.log(data); this.saveSpinner = false; },
      error: (error: any) => { console.error(error); this.saveSpinner = false; this.openErrorDialog('Oops... Une erreur est survenue lors de l operation') },
      complete: () => { console.info('complete'); this.saveSpinner = false; this.openSuccesDialog('Fiche enregistrée avec succès'); }
    })
  }



  //---------------------------------------------------------------------------

  periodeAcademiqueList() {
    this.api.periodeAcademiqueList().subscribe({
      next: (data: any) => { this.periodeAcademiques = data; console.log(data); },
      error: (error: any) => { console.error(error); },
      complete: () => { console.info('complete'); }
    })
  }//---------------------------------------------------------------------------

  parcoursAcademiqueList(id: number) {
    if (id) {
      this.displaySpinner = true;
      this.api.parcoursAcademiqueList(id).subscribe({
        next: (data: any) => { this.parcoursAcademiques = data; console.log(data); this.displaySpinner = false; },
        error: (error: any) => { console.error(error); this.displaySpinner = false; },
        complete: () => { console.info('complete'); }
      })
    }
  }

  ueListByParEnseignant(id: number) {
    if (id) {
      this.displaySpinner = true;
      console.log(id);
      this.api.ueListByParEnseignant(id, this.user.idenseignant).subscribe({
        next: (data: any) => {
          this.uniteEnseignements = data; console.log(data); this.displaySpinner = false;
        },
        error: (error: any) => { console.error(error); this.displaySpinner = false; },
        complete: () => { console.info('complete'); }
      })
    }
  }
  regroupementListByParcourList(id: number) {
    if (id) {
      this.displaySpinner = true;
      this.api.regroupementListByParcourList(id).subscribe({
        next: (data: any) => { this.regroupements = data; console.log(data); this.displaySpinner = false; },
        error: (error: any) => { console.error(error); this.displaySpinner = false; },
        complete: () => { console.info('complete'); }
      })
    }
  }
  //---------------------------------------------------------------------------
  //---------------------------------------------------------------------------
  //---------------------------------------------------------------------------

  promotionByParcList(event: { value: string }) {
    this.api.promotionByParcList(event.value).subscribe({
      next: (data: any) => { this.promotions = data; console.log('promotions'); console.log(data); },
      error: (error: any) => { console.error(error); },
      complete: () => { console.info('complete'); }
    });

  }
  //---------------------------------------------------------------------------
  regroupementListByPeriod() {
    this.api.regroupementListByPeriodList(this.courInitial.idperiode).subscribe({
      next: (data: any) => { this.regroupements = data; console.log(data); },
      error: (error: any) => { console.error(error); },
      complete: () => { console.info('complete'); }
    })
  }//---------------------------------------------------------------------------

  uniteEnseignementList() {
    if (this.user.idenseignant && this.courInitial.idregroupements) {
      this.displaySpinner = true;
      this.api.uniteEnseignementByProgEns(this.user.idenseignant, this.courInitial.idregroupements).subscribe({
        next: (data: any) => { this.uniteEnseignements = data; this.displaySpinner = false; console.log(data); },
        error: (error: any) => { console.error(error); this.displaySpinner = false; },
        complete: () => { console.info('complete'); this.displaySpinner = false; }
      });
    }
  }

  //---------------------------------------------------------------------------
  enseignantList(idue: number) {
    this.api.enseignantListByUe(idue).subscribe({
      next: (data: any) => { this.enseignants = data; console.log(data); },
      error: (error: any) => { console.error(error); },
      complete: () => { console.info('complete'); }
    });

  }

  //---------------------------------------------------------------------------
  courProgrammeList() {
    this.api.courProgrammeList().subscribe({
      next: (data: any) => { this.cours = data; console.log(data); },
      error: (error: any) => { console.error(error); },
      complete: () => { console.info('complete'); }
    })
  }

  courProgrammeListByRegroupement() {
    if (this.courInitial.idparcours && this.courInitial.idregroupements && this.courInitial.idue) {
      this.displaySpinner = true;
      this.api.courProgrammeListByRegroupement(this.courInitial.idparcours, this.courInitial.idregroupements, this.courInitial.idue).subscribe({
        next: (data: any) => { this.cours = data; this.displaySpinner = false; console.log(data); },
        error: (error: any) => { console.error(error); this.displaySpinner = false; },
        complete: () => { console.info('complete'); this.displaySpinner = false; }
      });
    }
  }


  //----------------------------------------------------------------------------

  validerPeriode() {
    if (this.cour.typePeriode == 'periode') {
      this.insertDaysIntoSessions(new Date(this.seance.datedeb), new Date(this.seance.datefin))
    } else {
      this.cours.push(this.seance); this.seance = new Cour(); console.log(this.cours);
    }
  }


  dateDiffInDays(startDate: Date, endDate: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // millisecondes par jour
    return Math.floor((endDate.getTime() - startDate.getTime()) / oneDay);
  }


  insertDaysIntoSessions(startDate: Date, endDate: Date) {
    const oneDay = 24 * 60 * 60 * 1000; // millisecondes par jour
    const daysDiff = this.dateDiffInDays(startDate, endDate);
    for (let i = 0; i < daysDiff; i++) {
      const n = new Cour(); n.datejour = new Date(startDate.getTime() + (i * oneDay)).toString(); n.heuredeb = this.seance.heuredeb; n.heurefin = this.seance.heurefin; this.cours.push(n);
    }
  }


  filterDates(exclureWeekends: boolean) {
    if (exclureWeekends) {
      this.cours.filter(elm => new Date(elm.datejour).getDay() !== 0 && new Date(elm.datejour).getDay() !== 6);
    } else {
      this.validerPeriode();
    }
  }


  //----------------------------------------------------------------------------
  seanceDelete(i: number) { this.cours.splice(i, 1); this.cours = [...this.cours]; }
  //----------------------------------------------------------------------------




  insert() {
    this.cour.user = 'admin';
    this.cours.forEach(element => {
      if (element.idcp) { this.programme.cours.push(element); }
      else { this.cour.enseignants = this.enseignantSelected; const _courID = `CP${new Date().toISOString().replace(/[-:]/g, '').replace('T', '').replace(/\..*$/, '')}.${Math.floor(Math.random() * 1000)}.${Math.floor(Math.random() * 1000)}`; this.cour.idcp = _courID; this.cour.datejour = new Date(formatDate(element.datejour, 'yyyy-MM-dd', 'en-US', '+0530')).toISOString().split('T')[0]; this.cour.heuredeb = element.heuredeb; this.cour.heurefin = element.heurefin; this.programme.cours.push(this.cour); }
    });
  }
  //----------------------------------------------------------------------------

  openDialog(ue: Ue) { this.programme = new Programme(); this.cour = this.courInitial; this.programme.idparcours = this.courInitial.idparcours; this.programme.idperiode = this.courInitial.idperiode; this.programme.idregroupements = 0; this.programme.user = 'admin'; this.cour.idue = ue.id; this.cour.libelleFr = ue.nomue; this.cour.libelleUs = ue.nomue; this.cour.typePeriode = 'periode'; this.seance = new Cour(); console.log(this.cour); this.displayDialog = true; }


  closeDialog() { this.displayDialog = false; }


  //----------------------------------------------------------------------------
  openReportDialog(c: Cour) { this.seance = c; this.displayReportDialog = true; }
  closeReportDialog() { this.displayReportDialog = false; }
  //----------------------------------------------------------------------------
  openAnnulerDialog(c: Cour) { this.seance = c; this.displayAnnulerDialog = true; }
  closeAnnulerDialog() { this.displayAnnulerDialog = false; }
  //----------------------------------------------------------------------------

  onEnseignantChange() {
    // this.cour.ensid = JSON.stringify(this.enseignantSelected);
  }


  //----------------------------------------------------------------------------
  openSuccesDialog(message: string) { this.succesMessage = message; this.displaySucces = true; }
  openErrorDialog(message: string) { this.errorMessage = message; this.displayError = true; }

  closeSucces() { this.displaySucces = false; }
  closeError() { this.displayError = false; }

  verifyLength(valeur: any) { let val = '' + valeur; if (val.toString().length >= 100) { return true; } return false; }
  defineDescription(libelle: any): string { let value = libelle.slice(0, 85); return value; }

  displayQRCore = false;
  showQrCode() {
    this.displayQRCore = true;
  }

  vi = false;
  printList(): void {
    this.vi = true;
    const tableau = document.getElementById('print-section');
    const contenuTableau = tableau?.outerHTML.replace('', ''); // Supprime les éléments de pagination du tableau
    const fenetreImpression = window.open('', '', 'height=450,width=650');

    fenetreImpression?.document.write(`
        <html>
            <head>
                <title>Fiche de présence</title>
                <style>
                    /* Ajoutez ici vos styles pour personnaliser l'impression */
                    @page {
                        size: landscape;
                    }
                    body {
                        font-family: Arial, sans-serif;
                    }
                </style>
            </head>
            <body>
             <div class="row">
                    <div class="col-md-4"></div>
                    <div class="col-md-4" style="text-align: center">
                        <img style="width: 80px; height: 80px; margin-top: 2%" src="assets/ismp.jpeg" />
                    </div>
                    <div class="col-md-4"></div>
                </div><br />
                <div class="row">
                    <div class="col-md-2"></div>
                    <div class="col-md-8" style="text-align: center">
                        <span><b>INSTITUT SUPÉRIEUR DE MANAGEMENT PUBLIC</b></span><br />
                        <span>BP 13719 Yaoundé (Cameroun) Tél.242 72 99 58/ 242 72 99 57</span><br />
                        <span><b>Site web :</b>www.ismpcameroun.com <b>Email</b>: contact@iaicameroun.com</span>
                    </div>
                    <div class="col-md-2"></div>
                </div><br />
                <div class="row">
                    <div class="col-md-2"></div>
                    <div class="col-md-8" style="text-align: center">
                        <span><b>FICHE DE PRESENCE</b></span><br />
                        <span>pour le cour de 
                        <span style="color: #007ad9;">${this.courusage.libelleFr}</span>, du 
                        <span style="color: #007ad9;">${this.courusage.datejour}</span></span><br />
                    </div>
                    <div class="col-md-2"></div>
                </div><br />
                <div class="row">
                    <div class="col-2"></div>
                    <div class="col-8" style="text-align: center;">
                         ${contenuTableau}
                    </div>
                    <div class="col-2"></div>
                </div>
            </body>
        </html>`
    );

    fenetreImpression?.document.close();
    fenetreImpression?.print();
  }


  libellecours = '';
  courusage = new Cour();
  getCours(idcp: string) {
    this.courusage = new Cour();
    for (const ele of this.cours) {
      if (ele.idcp == idcp) {
        this.courusage = ele;
      }
    }
  }
  /* 
    printMe() {
      const customPrintOptions: PrintOptions = new PrintOptions({
        printSectionId: 'print-section',
        printTitle: 'Fiche de presence',
        useExistingCss: false,
        bodyClass: '',
        openNewTab: false,
        previewOnly: false,
        closeWindow: true,
        printDelay: 0
      });
      this.printService.print(customPrintOptions)
    } */


}

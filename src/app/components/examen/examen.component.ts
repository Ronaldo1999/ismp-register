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

import { formatDate } from '@angular/common';
import { Programme } from 'src/app/class/programme/programme';
import { User } from 'src/app/class/user/user';
import { Examen } from 'src/app/class/exmen/examen';
import { Session } from 'src/app/class/session';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import '../../../../src/locale';


@Component({
  selector: 'app-examen',
  templateUrl: './examen.component.html',
  styleUrls: ['./examen.component.scss']
})
export class ExamenComponent {
  fparam: any;
  programme = new Programme();
  examens: Examen[] = [];
  examen: Examen = new Examen();
  examenTra: Examen = new Examen();
  periodeAcademiques: PeriodeAcademique[] = [];
  parcoursAcademiques: ParcourAcademique[] = [];
  promotions: Promotion[] = [];
  regroupements: Regroupement[] = [];
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
  succesMessage = ''
  errorMessage = ''
  user = new User();

  sessions: Session[] = [];
  sessionsRat: Session[] = [];

  constructor(
    private tokenStorageService: SessionStorageService, public dialog: DialogService, public api: ApiService, public dialogService: DialogService,
    public translate: TranslateService) {
    this.fparam = new FindParam(this.tokenStorageService.getOrganisation(), this.tokenStorageService.getUser().username);
    this.user = this.tokenStorageService.getUser();

  }

  ngOnInit(): void {
    this.examen = new Examen();

    this.periodeAcademiqueList();
  }

  getDate(date: any) {
    let res = '';
    if (date) {
      res = formatDate(new Date(date), 'EEEE dd MMMM yyyy', 'fr');
    }
    return res;
  }


  rechercher() {
    if (this.examen.idperiode && this.examen.idparcours && this.examen.idregroupement && this.examen.idue && this.examen.idsession) {
      this.examens = [];
      this.saveSpinner = true;
      this.api.examenList(this.examen.idperiode, this.examen.idparcours, this.examen.idregroupement, this.examen.idue, this.examen.idsession).subscribe({
        next: (data: any) => {
          this.examens = data;
          console.log(data); this.saveSpinner = false;
        },
        error: (error: any) => { console.error(error); this.saveSpinner = false; },
        complete: () => { console.info('complete'); this.saveSpinner = false; }
      });
    } else if (this.examen.idperiode && this.examen.idparcours && this.examen.idregroupement && !this.examen.idue && !this.examen.idsession) {
      this.examens = [];
      this.saveSpinner = true;
      this.api.examenListReg(this.examen.idperiode, this.examen.idparcours, this.examen.idregroupement).subscribe({
        next: (data: any) => {
          this.examens = data;
          console.log(data); this.saveSpinner = false;
        },
        error: (error: any) => { console.error(error); this.saveSpinner = false; },
        complete: () => { console.info('complete'); this.saveSpinner = false; }
      });
    } else {
      this.examens = [];
    }

  }

  updateProgrammation = false;
  action = '';
  create() {
    this.examenTra = new Examen();
    this.examenTra.id = 0;
    this.examenTra.etat = 0;
    this.examenTra.ip_update = '127.0.0.1';
    this.examenTra.daterep = '';
    this.examenTra.hdebutrep = '';
    this.examenTra.hfinrep = '';
    this.examenTra.idperiode = this.examen.idperiode;
    this.examenTra.idparcours = this.examen.idparcours;
    this.examenTra.idregroupement = this.examen.idregroupement;
    this.examenTra.idue = this.examen.idue;
    this.examenTra.idsession = this.examen.idsession;
    this.action = 'new';
    this.updateProgrammation = true;
  }

  saveSpinner = false;

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


  //---------------------------------------------------------------------------
  regroupementListByPeriod() { this.api.regroupementListByPeriodList(this.examen.idperiode).subscribe({ next: (data: any) => { this.regroupements = data; console.log(data); }, error: (error: any) => { console.error(error); }, complete: () => { console.info('complete'); } }) }

  //---------------------------------------------------------------------------
  uniteEnseignementList(idparcours: number) { if (idparcours) { this.uniteEnseignements = []; this.displaySpinner = true; this.api.uniteEnseignementByParcList(idparcours).subscribe({ next: (data: any) => { this.uniteEnseignements = data; this.displaySpinner = false; console.log(data); }, error: (error: any) => { console.error(error); this.displaySpinner = false; }, complete: () => { console.info('complete'); this.displaySpinner = false; } }); } }

  verifyLength(valeur: any) { let val = '' + valeur; if (val.toString().length >= 100) { return true; } return false; }
  defineDescription(libelle: any): string { let value = libelle.slice(0, 85); return value; }


  libellecours = '';
  courusage = new Cour();
  /*   getCours(idcp: string) {
      this.courusage = new Cour();
      for (const ele of this.cours) {
        if (ele.idcp == idcp) {
          this.courusage = ele;
        }
      }
    } */

  sessionListByCourid(id: number) {
    if (id) {
      this.sessions = [];
      this.sessionsRat = [];
      console.log(this.examenTra);
      console.log(id);
      this.displaySpinner = true;
      this.api.sessionListByCourid(id).subscribe((res: any) => {
        this.sessions = res;
        this.sessionsRat = this.filterByRattrapage(res);
        if (this.sessionsRat.length == 1) { this.examen.idsession = this.sessionsRat[0].id; }
        console.log(res);
        this.displaySpinner = false;
      }, () => {
        this.displaySpinner = false;
      });
    }
  }
  regroupementListByParcourList(id: number) { if (id) { this.displaySpinner = true; this.api.regroupementListByParcourList(id).subscribe({ next: (data: any) => { this.regroupements = data; console.log(data); this.displaySpinner = false; }, error: (error: any) => { console.error(error); this.displaySpinner = false; }, complete: () => { console.info('complete'); } }) } }

  filterByRattrapage(sessions: any[]): any[] {
    return sessions.filter(session =>
      /rattrapage|examen|d[eé]lib[eé]ration/i.test(session.description) || /rattrapage|examen|d[eé]lib[eé]ration/i.test(session.nom)
    );
  }

  messageDialog = false;
  srca = 'assets/img/attention.png';
  title = '';
  message = '';
  save() {
    this.saveSpinner = true;
    console.log(this.examenTra);
    const exam = this.examenTra;
    exam.user_update = this.user.email;
    this.api.examenInsert(exam).subscribe((res: any) => {
      console.log(res);
      this.saveSpinner = false;
      this.cancelDialog = false;
      this.updateProgrammation = false;
      this.reportProgrammation = false;
      this.rechercher();
      switch (this.action) {
        case 'new': this.succes('successSaveProgrammaton'); break;
        case 'edit': this.succes('successUpdateProgrammaton'); break;
        case 'cancel': this.succes('successCancelProgrammaton'); break;
        case 'report': this.succes('successReportProgrammaton'); break;
        default:
          break;
      }
    }, () => {
      this.saveSpinner = false;
      this.erreur('errorUpdateProgrammaton');
    });
  }

  cancelDialog = false;
  deleteDialog = false;
  messageCancelProgrammation = '';

  cancelProgrammation(examen: Examen) {
    this.examenTra = { ...examen };
    this.examenTra.etat = 1;
    this.action = 'cancel';
    this.messageCancelProgrammation = 'messageCancelProgrammation';
    this.srca = 'assets/img/attention.png';
    this.cancelDialog = true;
  }
  restoreProgrammation(examen: Examen) {
    this.examenTra = { ...examen };
    this.action = 'restore';
    this.srca = 'assets/img/question.png';
    this.messageCancelProgrammation = 'messageRestaureProgrammation';
    this.examenTra.etat = 0;
    this.cancelDialog = true;
  }
  getProgrammation(examen: Examen, action: string) {
    this.examenTra = { ...examen };
    this.action = action;
    if (action == 'report') {
      this.examenTra.etat = 2;
      this.reportProgrammation = true;
    } else {
      this.updateProgrammation = true;
    }
  }

  reportProgrammation = false;
  deleteProgrammation(examen: Examen) {
    this.examenTra = { ...examen };
    this.deleteDialog = true;
  }

  delete() {
    this.deleteDialog = false;
    this.saveSpinner = true;
    this.api.examenDelete(this.examenTra.id, this.user.email).subscribe(() => {
      this.saveSpinner = false;
      this.rechercher();
      this.succes('sucessDeleteProgrammation');
    }, () => {
      this.saveSpinner = false;
      this.erreur('errorDeleteProgrammaton');
    });
  }

  succes(msg: string) { this.srca = 'assets/img/ok.png'; this.title = 'Succes !'; this.message = msg; this.messageDialog = true; }
  erreur(msg: string) { this.srca = 'assets/img/attention.png'; this.title = 'Erreur !'; this.message = msg; this.messageDialog = true; }


  generatePDF(exams: Examen[]): void {
    const doc = new jsPDF();

    const tableData = exams.map(exam => {
      return [this.formatDate(exam.dateprog), `${exam.hdebut} - ${exam.hfin}`, exam.nomue];
    });

    const tableColumns = ['JOURS', 'HORAIRES', 'EXAMENS'];

    doc.setFontSize(12);
    doc.text('Semaine du ' + this.formatDate(exams[0].dateprog) + ' au ' + this.formatDate(exams[exams.length - 1].dateprog), doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
    doc.text('Preparations aux evaluations du premier semestre', doc.internal.pageSize.getWidth() / 2, 22, { align: 'center' });
    doc.text('Période du ' + this.formatDate(exams[0].dateprog) + ' au ' + this.formatDate(exams[exams.length - 1].dateprog), doc.internal.pageSize.getWidth() / 2, 29, { align: 'center' });
    doc.text('Session normale des examens de fin de premier semestre', doc.internal.pageSize.getWidth() / 2, 36, { align: 'center' });

    autoTable(doc, {
      head: [tableColumns],
      body: tableData,
      theme: 'grid', // Ajouter des bordures au tableau
      styles: { lineWidth: 0.1, halign: 'center' }, // Épaisseur des bordures
      margin: { top: 30 }, // Marge supérieure autour du tableau
      startY: 42,

      columnStyles: {
        0: { halign: 'center' }, // Aligner la première colonne au centre
        1: { halign: 'center' }, // Aligner la deuxième colonne au centre
        2: { halign: 'center' }  // Aligner la troisième colonne au centre
      },

      didDrawPage: data => {
        doc.setFontSize(10);
        doc.text('Page ' + doc.getNumberOfPages(), data.settings.margin.left, doc.internal.pageSize.getHeight() - 10);
      }
    });

    // Générer le PDF à partir du contenu HTML
    const pdfData = doc.output('datauristring');

    // Ouvrir le PDF dans une nouvelle fenêtre
    const newWindow = window.open();
    newWindow?.document.write('<html><head><title>Session normale</title></head><body>');

    newWindow?.document.write(`<iframe width='100%' height='100%' src='${pdfData}'></iframe>`);
    newWindow?.document.write('</body></html>');
  }

  private formatDate(date: any): string {
    return formatDate(new Date(date), 'EEEE dd MMMM yyyy', 'fr');
  }

}

import { Component, OnInit, Injectable } from '@angular/core';
import { Auditeur } from 'src/app/class/auditeur';
import { Cour } from 'src/app/class/cour/cour';
import { DivisionCalendaire } from 'src/app/class/divisionCalendaire/division-calendaire';
import { AuditeurNotation, GlobalNote, Notation, Note, SessionCour, SessionNotation } from 'src/app/class/notation';
import { ParcourAcademique } from 'src/app/class/parcourAcademique/parcour-academique';
import { PeriodeAcademique } from 'src/app/class/periodeAcademique/periode-academique';
import { Promotion } from 'src/app/class/promotion/promotion';
import { Regroupement } from 'src/app/class/regroupement/regroupement';
import { Session } from 'src/app/class/session';
import { Ue } from 'src/app/class/ue/ue';
import { ApiService } from 'src/app/services/api.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';


import * as QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import '../../../../src/locale';

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RowInput } from 'jspdf-autotable';

interface Bulletin {
  codegue: string;
  nomgue: string;
  id_ue: number;
  codeu: string;
  nomue: string;
  taflong: number;
  individuelle: number;
  examen: number;
  commentaire: string;
  matricule: string;
  nom: string;
  prenom: string;
  date: string;
  email: string;
  tel: string;
  moyenne_groupe: number;
  moyenne_generale: number;
}

@Component({
  selector: 'app-synthese',
  templateUrl: './notesynthese.component.html',
  styleUrls: ['./notesynthese.component.scss']
})
export class NoteSyntheseComponent implements OnInit {
  bulletins: Bulletin[] = [];
  displaySpinner: boolean = false;
  liste: any[] = [];
  notations: Notation[] = [];


  fparam: any;

  categorie = new Cour();
  cours: Cour[] = [];
  periodeAcademiques: PeriodeAcademique[] = [];
  parcoursAcademiques: ParcourAcademique[] = [];
  promotions: Promotion[] = [];
  regroupements: Regroupement[] = [];
  sessions: Session[] = [];
  auditeurs: Auditeur[] = [];
  divisionCalendaires: DivisionCalendaire[] = [];
  uniteEnseignements: Ue[] = [];
  selectedSession: SessionNotation = new SessionNotation();
  user: any;
  constructor(
    private api: ApiService,
    private ts: SessionStorageService,
  ) {
    this.user = this.ts.getUser();
  }

  ngOnInit() {
    this.getAllSession();
    this.periodeAcademiqueList();
  }

  reload() {
    this.notation = new Notation();
    this.auditeurs = [];
    this.base = 0;
    this.getAllSession();
    this.periodeAcademiqueList();
  }

  sessionNotation: SessionNotation = new SessionNotation();
  close() {

  }
  sessionNotations: SessionNotation[] = [];
  auditeurNotations: AuditeurNotation[] = [];
  totalPoid = 0;

  async generatePdf(idaudi: number) {
    await this.chargeBulletin(idaudi);
    if (this.bulletins.length > 0) {
      // this.generePdf();
    } else {
      console.error('Aucun bulletin disponible');
    }
  }
  chargeBulletin(idaudi: number): Promise<void> {
    if (this.notation.parcourAccademiqueID && this.notation.regroupementID && idaudi) {
      this.displaySpinner = true;
      return forkJoin([
        this.api.auditeurBulletinByID(this.notation.parcourAccademiqueID, this.notation.regroupementID, idaudi)
      ])
        .pipe(
          map(([bulletins]) => bulletins as Bulletin[])
        )
        .toPromise()
        .then(data => {
          this.bulletins = data || [];
          this.displaySpinner = false;
        })
        .catch(error => {
          console.error(error);
          this.displaySpinner = false;
        });
    }
    return Promise.resolve();
  }
  getElement(id: number, tab: any[]) {
    let element: any;
    for (const ele of tab) {
      if (ele.id == id) {
        element = ele;
      }
    }
    return element;
  }
  sessionsCours: SessionCour[] = [];
  sessionListByCourid(id: number) {
    this.sessionsCours = [];
    this.displaySpinner = true;
    this.cour = this.getElement(id, this.uniteEnseignements);
    this.api.sessionListByCourid(id).subscribe({
      next: (data: any) => {
        this.sessionsCours = data; console.log(data);
        this.displaySpinner = false;
      },
      error: (error: any) => { console.error(error); this.displaySpinner = false; },
      complete: () => { console.info('complete'); }
    })
  }//---------------------------------------------------------------------------

  getSess(id: number) {
    let session = new Session();
    for (const ele of this.sessions) {
      if (ele.id == id) {
        session = ele;
      }
    }
    return session;
  }
  getSess2(id: number) {
    let session = new SessionCour();
    for (const ele of this.sessionsCours) {
      if (ele.idsession == id) {
        session = ele;
      }
    }
    return session;
  }

  getByID(id: number, tab: any[]) {
    let resultat: any;
    for (const ele of tab) {
      if (ele.id == id) {
        resultat = ele;
      }
    }
    return resultat;
  }
  base = 0;

  messageDialog = false;
  srca = 'assets/img/attention.png';
  title = '';
  message = '';
  save(valide: number) {
    if (this.base == 0) {
      this.messageDialog = true;
      this.message = 'Veuillez renseigner la base svp !';
      this.title = 'Attention !';
    } else {
      this.displaySpinner = true;
      this.messageDialog = false;
      let gn = new GlobalNote();
      gn.id = 0;
      gn.notes = [];
      for (const ele of this.auditeurs) {
        let note: Note = new Note();
        note.idreg = this.notation.regroupementID;
        note.idue = this.notation.coursID;
        note.idsession = this.notation.sessionID;
        note.idaudi = ele.id;
        note.note = ele.note;
        note.base = this.base;
        note.poids = this.getSess2(this.notation.sessionID).poids;
        note.valide = valide;
        gn.notes.push(Object.assign({}, note));
      }
      console.log(gn);
      this.api.insertNotation(gn).subscribe((res: any) => {
        this.auditeursList();
        this.updateDialog = false;
        if (valide == 0) {
          this.succes('successSaveNotation');
        } else {
          this.succes('successValidation');
        }
      }, error => {
        this.erreur('erreurSaveNotation');
        this.displaySpinner = false;
      });
    }
  }


  getAllNotation() {
    this.displaySpinner = true;
    this.notations = [];
    this.api.getAllNotation().subscribe((res: any) => {
      this.notations = res;
      this.displaySpinner = false;
      console.log(res);
    });
  }

  rechercher() {
    if (this.notation.parcourAccademiqueID && this.notation.regroupementID) {
      this.displaySpinner = true;
      this.api.ueListByEnseignant(this.notation.parcourAccademiqueID, this.notation.regroupementID, this.user.idenseignant).subscribe({
        next: (data: any) => { this.uniteEnseignements = data; console.log(data); this.displaySpinner = false; },
        error: (error: any) => { console.error(error); this.displaySpinner = false; },
        complete: () => { console.info('complete'); this.displaySpinner = false; }
      });
    }
  }


  periodeAcademiqueList() {
    this.displaySpinner = true;
    this.api.periodeAcademiqueList().subscribe({
      next: (data: any) => { this.periodeAcademiques = data; console.log(data); this.displaySpinner = false; },
      error: (error: any) => { console.error(error); this.displaySpinner = false; },
      complete: () => { console.info('complete'); }
    })
  }//---------------------------------------------------------------------------

  //----------------------------------------- parcoursAcademiqueList ----------------------------------

  parcoursAcademiqueList(id: number) {
    if (id) {
      this.displaySpinner = true;
      this.api.parcoursAcademiqueList(id).subscribe({
        next: (data: any) => { this.parcoursAcademiques = data; console.log(data); this.displaySpinner = false; },
        error: (error: any) => { console.error(error); this.displaySpinner = false; },
        complete: () => { console.info('complete'); }
      })
    }
  }//---------------------------------------------------------------------------
  chargementEnCours = false;
  auditeursListByReg(id: number) {
    if (id) {
      this.displaySpinner = true;
      this.api.auditeursListByReg(id).subscribe({
        next: (data: any) => {
          this.auditeurs = data;
          this.base = data[0].base;
          console.log(data);
          this.displaySpinner = false;
        },
        error: (error: any) => { console.error(error); this.displaySpinner = false; },
        complete: () => { console.info('complete'); }
      })
    }
  }//---------------------------------------------------------------------------
  uniteEnseignementListByParcour(id: number) {
    if (id) {
      this.getParcour(id);
      this.displaySpinner = true;
      console.log(id);
      this.api.uniteEnseignementListByParcour(id).subscribe({
        next: (data: any) => {
          this.uniteEnseignements = data; console.log(data); this.displaySpinner = false;
        },
        error: (error: any) => { console.error(error); this.displaySpinner = false; },
        complete: () => { console.info('complete'); }
      })
    }
  }//---------------------------------------------------------------------------
  ueListByParEnseignant(id: number) {
    if (id) {
      this.getParcour(id);
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

  parcou = new ParcourAcademique();

  getParcour(id: number) {
    this.parcou = new ParcourAcademique();
    for (const ele of this.parcoursAcademiques) {
      if (ele.id == id) {
        this.parcou = ele;
      }
    }
  }
  //---------------------------------------------------------------------------
  //---------------------------------------------------------------------------
  regroupementListByPeriodList(id: number) {
    this.displaySpinner = true;
    this.api.regroupementListByPeriodList(id).subscribe({
      next: (data: any) => { this.regroupements = data; console.log(data); this.displaySpinner = false; },
      error: (error: any) => { console.error(error); this.displaySpinner = false; },
      complete: () => { console.info('complete'); }
    })
  }//---------------------------------------------------------------------------
  regroupementListByParcourList(id: number) {
    this.displaySpinner = true;
    this.api.regroupementListByParcourList(id).subscribe({
      next: (data: any) => { this.regroupements = data; console.log(data); this.displaySpinner = false; },
      error: (error: any) => { console.error(error); this.displaySpinner = false; },
      complete: () => { console.info('complete'); }
    })
  }//---------------------------------------------------------------------------
  sessionByCoursList(id: number) {
    this.displaySpinner = true;
    this.api.sessionByCoursList(id).subscribe({
      next: (data: any) => { this.regroupements = data; console.log(data); this.displaySpinner = false; },
      error: (error: any) => { console.error(error); this.displaySpinner = false; },
      complete: () => { console.info('complete'); }
    })
  }//---------------------------------------------------------------------------

  getAllSession() {
    this.displaySpinner = true;
    this.sessions = [];
    this.api.getAllSession().subscribe((res: any) => {
      this.sessions = res;
      this.displaySpinner = false;
      console.log(res);
    }, error => { this.displaySpinner = false; });
  }
  action = '';
  libelleNotation = '';
  updateDialog = false;
  notation: Notation = new Notation();
  create() {
    this.action = 'new';
    this.libelleNotation = 'Nouvelle notation';
    this.notation = new Notation();
    this.updateDialog = true;
  }

  verifyLength(valeur: any) { let val = '' + valeur; if (val.toString().length >= 100) { return true; } return false; }
  defineDescription(libelle: any): string { let value = libelle.slice(0, 85); return value; }

  auditeursList() {
    if (this.notation.regroupementID && this.notation.sessionID && this.notation.coursID) {
      this.displaySpinner = true;
      this.api.auditeursNoteList(this.notation.regroupementID, this.notation.coursID, this.notation.sessionID).subscribe({
        next: (data: any) => { this.auditeurs = data; this.base = data[0].base; console.log(data); this.displaySpinner = false; },
        error: (error: any) => { console.error(error); this.displaySpinner = false; },
        complete: () => { console.info('complete'); }
      })
    }
  }//---------------------------------------------------------------------------

  nomreg = '';
  nomprenom = '';
  datenaiss = '';
  matricule = '';
  anne = '';
  auditeursListDefinitive() {
    if (this.notation.regroupementID && this.notation.coursID) {
      this.displaySpinner = true;
      this.nomreg = this.getElement(this.notation.regroupementID, this.regroupements).nomreg;
      this.api.auditeursListDefinitive(this.notation.regroupementID, this.notation.coursID).subscribe({
        next: (data: any) => { this.auditeurs = data; console.log(data); this.displaySpinner = false; },
        error: (error: any) => { console.error(error); this.displaySpinner = false; },
        complete: () => { console.info('complete'); }
      })
    }
  }//---------------------------------------------------------------------------
  tabnotes: any[] = [];
  auditeurBulletinByID(idaudi: number) {
    if (this.notation.parcourAccademiqueID && this.notation.regroupementID && idaudi) {
      this.displaySpinner = true;
      this.api.auditeurBulletinByID(this.notation.parcourAccademiqueID, this.notation.regroupementID, idaudi).subscribe({
        next: (data: any) => {
          this.tabnotes = data; console.log(data);
          // this.imprimerPDFParId(data);
          this.displaySpinner = false;
        },
        error: (error: any) => { console.error(error); this.displaySpinner = false; },
        complete: () => { console.info('complete'); }
      })
    }
  }//---------------------------------------------------------------------------


  valide(tab: any[]): boolean { return tab.every(element => element.valide === 1); }
  succes(msg: string) { this.srca = 'assets/img/ok.png'; this.title = 'Succes !'; this.message = msg; this.messageDialog = true; }
  erreur(msg: string) { this.srca = 'assets/img/attention.png'; this.title = 'Erreur !'; this.message = msg; this.messageDialog = true; }

  cour = new Cour();
  getStatut(id: number) { let res = ''; if (id == 0) { res = 'PROVISOIRE' } else { res = 'DEFINITIF' } return res; }
  getProperty(property: any) { let res; if (property == 0 || property == '') { res = '/'; } else { res = property } return res; }
  getSeverty(property: string) { let res; if (property == 'AJOURNEE') { res = 'danger'; } else { res = 'success' } return res; }

  generatePDF(auditeurs: Auditeur[]): void {
    const doc = new jsPDF('landscape');
    doc.addImage('../../../assets/ismp.jpeg', 'JPEG', 10, 10, 35, 30); // Ajouter l'image à gauche
    doc.setFontSize(12);
    doc.text('PROGRAMME DE MASTER PROFESSIONNEL EN MANAGEMENT PUBLIC (MP2)', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    doc.text('YAOUNDÉ ' + this.nomreg, doc.internal.pageSize.getWidth() / 2, 27, { align: 'center' });
    doc.text('COURS DE ' + this.cour.nomue, doc.internal.pageSize.getWidth() / 2, 34, { align: 'center' });
    doc.setFontSize(14);
    doc.setFont('Arial', 'bold');
    doc.text('SYNTHÈSE DES NOTES', doc.internal.pageSize.getWidth() / 2, 41, { align: 'center' });

    // Calculer la position de départ et de fin de la ligne de soulignement
    const textWidth = doc.getStringUnitWidth('SYNTHÈSE DES NOTES') * 14 / doc.internal.scaleFactor;
    const startX = (doc.internal.pageSize.getWidth() - textWidth) / 2;
    const endX = startX + textWidth;

    doc.setLineWidth(0.1);
    doc.line(startX, 43, endX, 43);
    // Ajouter une deuxième image à droite si nécessaire
    doc.addImage('../../../assets/soa.png', 'PNG', doc.internal.pageSize.getWidth() - 50, 10, 30, 35);

    // Définir le filigrane
    doc.setFontSize(40);
    doc.setTextColor(150);
    doc.text('ISMP-PLANNING PLATEFORM', doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() / 2, { align: 'center', angle: 45 });


    // Ajouter le pied de page avec le copyright
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`from ISMP-PLANNING-PLATEFORM - Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    }

    // Ajouter le tableau avec les colonnes et les valeurs
    const tableColumns = ['N°', "Matricule", "Nom(s) & prénom(s)", "Long", "Individuelle", "Examen", "Pondérée/100", "Moyenne", "Décision", "Statut"];
    const tableData = auditeurs.map((exam, index) => {
      return [index + 1, this.getProperty(exam.matricule), this.getProperty(exam.nom) + ' - ' + this.getProperty(exam.prenom),
      exam.taflong, exam.individuelle, exam.examen,
      this.getProperty(exam.notepondere), exam.moyenne, this.getProperty(exam.commentaire), this.getStatut(exam.valide)];
    });

    const totalWidth = doc.internal.pageSize.getWidth();
    autoTable(doc, {
      head: [tableColumns],
      body: tableData,
      theme: 'grid',
      styles: { lineWidth: 0.1 },
      margin: { top: 30 },
      startY: 52,
      headStyles: { fillColor: [121, 46, 29], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9, halign: 'center', valign: 'middle', },
      columnStyles: {
        0: { valign: 'middle', halign: 'center', fontStyle: 'bold', textColor: '#007ad9', cellWidth: (totalWidth * 0.05) },
        1: { valign: 'middle', halign: 'center', fontSize: 10, fontStyle: 'bolditalic', cellWidth: (totalWidth * 0.08) },
        2: { valign: 'middle', halign: 'left', fontSize: 10, fontStyle: 'bold', cellWidth: (totalWidth * 0.25) },
        3: { valign: 'middle', halign: 'center', fontSize: 10, fontStyle: 'bold', cellWidth: (totalWidth * 0.07) },
        4: { valign: 'middle', halign: 'center', fontSize: 10, fontStyle: 'bold', cellWidth: (totalWidth * 0.07) },
        5: { valign: 'middle', halign: 'center', fontSize: 10, fontStyle: 'bold', cellWidth: (totalWidth * 0.07) },
        6: { valign: 'middle', halign: 'center', fontSize: 10, fontStyle: 'bold', cellWidth: (totalWidth * 0.07) },
        7: { valign: 'middle', halign: 'center', fontSize: 10, fontStyle: 'bold', cellWidth: (totalWidth * 0.08) },
        8: { valign: 'middle', halign: 'center', fontSize: 10, fontStyle: 'bold', cellWidth: (totalWidth * 0.08) },
        9: { valign: 'middle', halign: 'center', fontSize: 10, fontStyle: 'bold', cellWidth: (totalWidth * 0.08) }
      },
      didParseCell: function (data) {
        if (data.column.dataKey === 'Note') {
          const note = parseInt(data.cell.raw as string);
          if (!isNaN(note) && note === 18) {
            data.cell.styles.fillColor = [0, 128, 0];
          }
        }
      }
    });
    const pdfData = doc.output('datauristring');
    const newWindow = window.open();
    newWindow?.document.write('<html><head><title>RECAP DES NOTES</title></head><body>');
    newWindow?.document.write(`<iframe width='100%' height='100%' src='${pdfData}'></iframe>`);
    newWindow?.document.write('</body></html>');
  }
  bulletin(idaudi: number): void {
    if (this.notation.parcourAccademiqueID && this.notation.regroupementID && idaudi) {
      this.displaySpinner = true;
      this.api.auditeurBulletinByID(this.notation.parcourAccademiqueID, this.notation.regroupementID, idaudi).subscribe({
        next: (data: any) => {
          this.bulletins = data; console.log(data);
          this.displaySpinner = false;
          const doc = new jsPDF();
          //doc.addImage('../../../assets/ismp.jpeg', 'JPEG', 10, 10, 35, 30); // Ajouter l'image à gauche
          doc.setFontSize(12);
          doc.text('MASTER PROFESSIONNEL EN MANAGEMENT PUBLIC (MP2)', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
          doc.text('YAOUNDÉ ' + this.nomreg, doc.internal.pageSize.getWidth() / 2, 27, { align: 'center' });
          doc.text('YAOUNDÉ ' + this.nomreg, doc.internal.pageSize.getWidth() / 2, 27, { align: 'center' });
          doc.setFontSize(14);
          doc.setFont('Arial', 'bold');
          doc.text('BULLETIN DE NOTE SYNTHTISÉ', doc.internal.pageSize.getWidth() / 2, 41, { align: 'center' });

          // Calculer la position de départ et de fin de la ligne de soulignement
          const textWidth = doc.getStringUnitWidth('BULLETIN DE NOTE SYNTHTISÉ') * 14 / doc.internal.scaleFactor;
          const startX = (doc.internal.pageSize.getWidth() - textWidth) / 2;
          const endX = startX + textWidth;

          doc.setLineWidth(0.1);
          doc.line(startX, 43, endX, 43);
          // Ajouter une deuxième image à droite si nécessaire
          //doc.addImage('../../../assets/soa.png', 'PNG', doc.internal.pageSize.getWidth() - 50, 10, 30, 35);

          // Ajouter le pied de page avec le copyright
          const pageCount = doc.getNumberOfPages();
          for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text(`from ISMP-PLANNING-PLATEFORM - Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
          }

          const tableData: RowInput[] = [];

          /* const groupedData: { [key: string]: RowInput[] } = {};

          this.bulletins.forEach(bulletin => {
            const key = bulletin.codegue;
            if (!groupedData[key]) {
              groupedData[key] = [];
            }
            groupedData[key].push([
              `${bulletin.codegue} - ${bulletin.nomgue}`,
              `${bulletin.codeu} - ${bulletin.nomue}`,
              bulletin.taflong.toFixed(2),
              bulletin.individuelle.toFixed(2),
              bulletin.examen.toFixed(2),
              bulletin.commentaire
            ]);
          });

          for (const key in groupedData) {
            if (Object.prototype.hasOwnProperty.call(groupedData, key)) {
              const groupRows: RowInput[] = groupedData[key];
              const groupCell = {
                content: `${key} - ${groupRows[0].toString}`, // Accéder à la propriété appropriée (par exemple, 'text')
                rowSpan: groupRows.length
              };
              groupRows[0] = groupCell;
              tableData.push(...groupRows);
            }
          } */

          this.bulletins.forEach(bulletin => {
            tableData.push([
              `${bulletin.codegue} - ${bulletin.nomgue}`,
              `${bulletin.codeu} - ${bulletin.nomue}`,
              bulletin.taflong.toFixed(2),
              bulletin.individuelle.toFixed(2),
              bulletin.examen.toFixed(2),
              bulletin.commentaire
            ]);
            tableData.push([
              { content: 'Moyenne du groupe', styles: { halign: 'center', fontSize: 10, fillColor: [205, 205, 205], textColor: [255, 255, 255] } },
              { content: '', styles: { halign: 'center', fontSize: 10, fillColor: [205, 205, 205], textColor: [255, 255, 255] } },
              { content: '', styles: { halign: 'center', fontSize: 10, fillColor: [205, 205, 205], textColor: [255, 255, 255] } },
              { content: '', styles: { halign: 'center', fontSize: 10, fillColor: [205, 205, 205], textColor: [255, 255, 255] } },
              { content: '', styles: { halign: 'center', fontSize: 10, fillColor: [205, 205, 205], textColor: [255, 255, 255] } },
              { content: bulletin.moyenne_groupe.toFixed(2), styles: { fontStyle: 'bold', fontSize: 12, fillColor: [205, 205, 205], textColor: [255, 255, 255] } }
            ]);
          });
          tableData.push([
            { content: 'MOYENNE GÉNÉRALE', styles: { halign: 'center', fontSize: 10, fillColor: [205, 205, 205], textColor: [255, 255, 255] } },
            { content: '', styles: { halign: 'center', fontSize: 10, fillColor: [205, 205, 205], textColor: [255, 255, 255] } },
            { content: '', styles: { halign: 'center', fontSize: 10, fillColor: [205, 205, 205], textColor: [255, 255, 255] } },
            { content: '', styles: { halign: 'center', fontSize: 10, fillColor: [205, 205, 205], textColor: [255, 255, 255] } },
            { content: '', styles: { halign: 'center', fontSize: 10, fillColor: [205, 205, 205], textColor: [255, 255, 255] } },
            { content: this.bulletins[0].moyenne_generale.toFixed(2), styles: { fontStyle: 'bold', fontSize: 12, fillColor: [205, 205, 205], textColor: [255, 255, 255] } }
          ]);

          autoTable(doc, {
            head: [['Groupe', 'Unité de valeur', 'Taflong', 'Individuelle', 'Examen', 'Commentaire']],
            body: tableData,
            startY: 65,
            styles: {
              fontSize: 10,
              cellPadding: 3
            },
            columnStyles: {
              0: { cellWidth: 'auto' },
              1: { cellWidth: 'auto' }
            },
            didDrawCell: (data) => {
              if (data.row.section === 'body' && data.row.index % 2 === 1) {
                doc.setFillColor(240, 240, 240);
                doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
              }
            },
            margin: { top: 20, right: 20, bottom: 20, left: 20 }
          });




          doc.setFontSize(12);
          doc.text(`Matricule: ${this.bulletins[0].matricule}`, 15, 50);
          doc.text(`Nom: ${this.bulletins[0].nom}`, 15, 55);
          doc.text(`Prénom: ${this.bulletins[0].prenom}`, 15, 60);

          doc.text(`Date: ${this.bulletins[0].date}`, doc.internal.pageSize.getWidth() / 2, 50);
          doc.text(`Email: ${this.bulletins[0].email}`, doc.internal.pageSize.getWidth() / 2, 55);
          doc.text(`Téléphone: ${this.bulletins[0].tel}`, doc.internal.pageSize.getWidth() / 2, 60);

          const pdfData = doc.output('datauristring');
          const newWindow = window.open();
          newWindow?.document.write('<html><head><title>Bulletin de note de ' + this.bulletins[0].nom + '' + this.bulletins[0].prenom + '</title></head><body>');
          newWindow?.document.write(`<iframe width='100%' height='100%' src='${pdfData}'></iframe>`);
          newWindow?.document.write('</body></html>');
        },
        error: (error: any) => { console.error(error); this.displaySpinner = false; },
        complete: () => { console.info('complete'); }
      })
    }
  }


}
import { Component, OnInit } from '@angular/core';
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
@Component({
  selector: 'app-notevalidation',
  templateUrl: './notevalidation.component.html',
  styleUrls: ['./notevalidation.component.scss']
})
export class NotevalidationComponent implements OnInit {

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
  displaySpinner = false;
  saveSessNot() {
    this.sessionNotation.sessionNotationID = this.sessionNotations.length + 1;
    this.sessionNotations.push(Object.assign({}, this.sessionNotation));
    this.totalPoid += this.sessionNotation.poids;
    console.log(this.sessionNotation);
    console.log(this.sessionNotations);
    this.sessionNotation = new SessionNotation();
  }

  sessionsCours: SessionCour[] = [];
  sessionListByCourid(id: number) {
    this.displaySpinner = true;
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

  getTypeRes(libeller: string) {
    let res = 0;
    switch (libeller) {
      case 'TRAVAIL LONG': res = 1; break;
      case 'TRAVAIL INDIVIDUEL': res = 2; break;
      case 'EXAMEN SUR TABLE': res = 3; break;
      default:
        break;
    }
    return res;
  }
  displayGSpinner = false;
  valider() {
    this.displayGSpinner = true;
    this.messageDialog = false;
    let gn = new GlobalNote();
    gn.id = 0;
    gn.valide = 1;
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
      note.userValidation = this.user.iduser;
      note.idens = this.user.idenseignant;
      note.valide = 1;
      note.type = this.getTypeRes(this.getSess2(this.notation.sessionID).nom);
      gn.notes.push(Object.assign({}, note));
    }
    console.log(gn);
    this.api.insertNotation(gn).subscribe((res: any) => {
      this.displayGSpinner = false;
      this.auditeursList();
      this.succes('successValidation');
    }, error => {
      this.erreur('erreurValidation');
      this.displayGSpinner = false;
    });
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
    this.displaySpinner = true;
    this.api.parcoursAcademiqueList(id).subscribe({
      next: (data: any) => { this.parcoursAcademiques = data; console.log(data); this.displaySpinner = false; },
      error: (error: any) => { console.error(error); this.displaySpinner = false; },
      complete: () => { console.info('complete'); }
    })
  }//---------------------------------------------------------------------------
  chargementEnCours = false;
  auditeursListByReg(id: number) {
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
  }//---------------------------------------------------------------------------
  uniteEnseignementListByParcour(id: number) {
    this.displaySpinner = true;
    console.log(id);
    this.api.uniteEnseignementListByParcour(id).subscribe({
      next: (data: any) => {
        this.uniteEnseignements = data; console.log(data); this.displaySpinner = false;
      },
      error: (error: any) => { console.error(error); this.displaySpinner = false; },
      complete: () => { console.info('complete'); }
    })
  }//---------------------------------------------------------------------------
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
  }//---------------------------------------------------------------------------
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
        next: (data: any) => { this.auditeurs = data; this.base = 20; console.log(data); this.displaySpinner = false; },
        error: (error: any) => { console.error(error); this.displaySpinner = false; },
        complete: () => { console.info('complete'); }
      })
    }
  }//---------------------------------------------------------------------------



  valide(tab: any[]): boolean {
    return tab.every(element => element.valide === 1);
  }
  succes(msg: string) {
    this.srca = 'assets/img/ok.png';
    this.title = 'Succes !';
    this.message = msg;
    this.messageDialog = true;
  }
  erreur(msg: string) {
    this.srca = 'assets/img/attention.png';
    this.title = 'Erreur !';
    this.message = msg;
    this.messageDialog = true;
  }

}

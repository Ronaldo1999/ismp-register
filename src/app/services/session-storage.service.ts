import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const ITEM_KEY = 'item';
const MODULE_KEY = 'module';
const ORG_KEY = 'organisation';
const ORG_LIB = 'LibelleOrganisation';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }


  signOut(): void { window.sessionStorage.clear(); }

  public saveToken(token: string): void { window.sessionStorage.removeItem(TOKEN_KEY); window.sessionStorage.setItem(TOKEN_KEY, token); }

  public getToken(): any { return window.sessionStorage.getItem(TOKEN_KEY); }

  public saveUser(user: any): void { window.sessionStorage.removeItem(USER_KEY); window.sessionStorage.setItem(USER_KEY, JSON.stringify(user)); }

  public saveOrganisation(organisationID: string, libelleFr: string): void {
    window.sessionStorage.removeItem(ORG_KEY);
    window.sessionStorage.setItem(ORG_KEY, organisationID);
    window.sessionStorage.removeItem(ORG_LIB);
    window.sessionStorage.setItem(ORG_LIB, libelleFr);
  }

  public getOrganisation(): any { return window.sessionStorage.getItem(ORG_KEY); }

  public getOrganisationLibelleFr(): any { return window.sessionStorage.getItem(ORG_LIB); }

  public savePoste(posteID: string[]): void { let i: number = 0; for (let p of posteID) { i = i + 1; window.sessionStorage.removeItem('poste' + i); window.sessionStorage.setItem('poste' + i, p); } }

  public getPostes(): any { let postes: any[] = []; for (let i = 1; i <= window.sessionStorage.length; i++) { postes.push(window.sessionStorage.getItem('poste' + i)); } return postes; }

  public saveActivePoste(posteID: string): void { window.sessionStorage.removeItem('activePoste'); window.sessionStorage.setItem('activePoste', posteID); }

  public getActivePoste(): any { return window.sessionStorage.getItem('activePoste'); }


  public saveModule(module: string): void { window.sessionStorage.removeItem(MODULE_KEY); window.sessionStorage.setItem(MODULE_KEY, module); }

  public getCurrentModule() { return window.sessionStorage.getItem(MODULE_KEY); }

  public getUser(): any { const user = window.sessionStorage.getItem(USER_KEY); if (user) { return JSON.parse(user); } return {}; }

  public saveRole(roles: string[]): void { let i: number = 0; for (let ROLE_KEY of roles) { i = i + 1; window.sessionStorage.removeItem('R' + i); window.sessionStorage.setItem('R' + i, ROLE_KEY) } }

  public getRoles(): any { let roles: any[] = []; for (let i = 1; i <= window.sessionStorage.length; i++) { roles.push(window.sessionStorage.getItem('R' + i)); } return roles; }

  public saveTicketRole(ticketRoles: string[]): void { let i: number = 0; for (let TICKET_ROLE_KEY of ticketRoles) { i = i + 1; window.sessionStorage.removeItem('TR' + i); window.sessionStorage.setItem('TR' + i, TICKET_ROLE_KEY); } }

  public getTicketRoles(): any { let ticketRoles: any[] = []; for (let i = 1; i <= window.sessionStorage.length; i++) { ticketRoles.push(window.sessionStorage.getItem('TR' + i)); } return ticketRoles; }



  public saveActiveItem(item: string): void { window.sessionStorage.removeItem(ITEM_KEY); window.sessionStorage.setItem(ITEM_KEY, item); }

  public getActiveItem() { return window.sessionStorage.getItem(ITEM_KEY); }

  getAll() {
    console.log(this.getRoles());
    // console.log(this.getTicketRoles());
    // console.log(this.getToken());
    // console.log(this.getUser());
    console.log(this.getOrganisation());
    console.log(this.getActiveItem());
    console.log(this.getCurrentModule());
  }
}

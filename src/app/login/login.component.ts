import { Component } from '@angular/core';
import { Organisation } from '../class/organisation/organisation';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { User } from '../class/user/user';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SessionStorageService } from '../services/session-storage.service';
import { ApiService } from '../services/api.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  form: any = {
    username: null,
    password: null
  };

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  lang: string = "fr";
  value1: string = "fr";
  stateOptions: any[] = [];

  libelleFr: string = 'Login.enteteFr';
  libelleEnglish: string = 'Login.enteteEn';
  urlImage: string = 'assets/avia.jpg';
  slogan: string = 'Login.slogan';

  displaySpinner = false
  user: User = new User()

  displayError = false
  displaySucces = false
  succesMessage: string = '';
  displayAffecter = false
  displayAffecterPoste = false
  ref!: DynamicDialogRef;

  organisations: Organisation[] = []





  constructor(public dialogService: DialogService, public translate: TranslateService, private router: Router,
      private tokenStorage: SessionStorageService, private api: ApiService) { }


  ngOnInit(): void {
    this.show();
    if (this.tokenStorage.getToken()) { this.isLoggedIn = true; this.roles = this.tokenStorage.getUser().roles; };
    this.stateOptions = [{ label: 'Français', value: 'fr' }, { label: 'English', value: 'en' }];
  }

  show(): void {
    let slogan = <HTMLElement>document.getElementById('slogan');
    let produit = <HTMLElement>document.getElementById('produit');
    let libelleFr = <HTMLElement>document.getElementById('libelleFr');
    let libelleEnglish = <HTMLElement>document.getElementById('libelleEnglish');

    produit.innerHTML = 'AUDIT OACI';
    libelleFr.innerHTML = 'AUTORITE AERONAUTIQUE';
    libelleEnglish.innerHTML = 'CAMEROUN CIVIL AVIATION AUTHORITY';
    slogan.innerHTML = "Plateforme Pour La Gestion De L'audit OACI 2023";
  }


  onSubmit(): void {


    this.router.navigate(['home']);


    this.displaySpinner = true;
    const { username, password } = this.form;

    // this.authService.login(username, password).subscribe(
    //   data => {
    //     console.log(data);
    //     this.tokenStorage.saveToken(data.accessToken);
    //     this.tokenStorage.saveUser(data);
    //     this.isLoginFailed = false; this.isLoggedIn = true;
    //     this.roles = this.tokenStorage.getUser().roles;
    //     this.userLogin(data.username);

    //     this.api.roleListByUser(username).subscribe(res => { this.tokenStorage.saveRole(res); }, error => { console.log(error.error); });
    //     console.log(this.tokenStorage.getUser().roles); this.getOrganisationByUser(); this.displaySpinner = false; this.router.navigate(['home/load']);
    //   },
    //   err => {
    //     console.log(err.error);
    //     if (err.statusText == 'Unknown Error') { this.errorMessage = this.translate.instant('Impossible de joindre le serveur'); }
    //     else if (err.error.error == 'Unauthorized') { this.errorMessage = this.translate.instant('Identifiants incorrects'); }
    //     else { this.errorMessage = err.error; }
    //     this.displaySpinner = false; this.isLoginFailed = true;
    //   }
    // );
    
  }

  // userLogin(login: string) { this.api.userLogin(login).subscribe(data => { }) }

  reloadPage(): void { window.location.reload(); }

  getSiteMinT() { const URL = 'https://www.mintransports.net'; window.open(URL); }

  changeLang(lang: string) { this.translate.use(lang); }

  habilitation(code: string) {
    let roles = this.tokenStorage.getRoles();
    for (let role of roles) { if (role == code) { return true; } }; return false;
  }

  addUser() {
    // this.ref = this.dialogService.open(EditUserComponent, {
    //   header: this.translate.instant('auser'),
    //   width: '1200px',
    //   contentStyle: { "max-height": "1200px", "overflow": "auto" },
    //   closable: false,
    //   data: { param: 'insert', user: this.user, structures: this.structures }
    // });

    // this.ref.onClose.subscribe((data) => { this.displaySucces = true; }, error => { this.displayError = true; });
  }

  getOrganisationByUser() {
    // this.api.organisationListByUser('fr', this.tokenStorage.getUser().username).subscribe(data => {
    //   this.organisations = data; this.tokenStorage.saveOrganisation(data[0].organisationID, data[0].libelleFr);
    // })
  }

  closeSucces() { this.displaySucces = false; }

  closeError() { this.displayError = false; }

}

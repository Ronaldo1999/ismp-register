import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { SessionStorageService } from '../services/session-storage.service';
import { FindParam } from '../class/find-param';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  title = 'courrier';
  lang: string = "fr";
  rechercheVal: string = ""
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;
  display = false;
  displayE = false;
  displayN = false;

  nbrMessages: number = 0
  nbrNotifications: number = 0



  constructor(private router: Router, private tokenStorageService: SessionStorageService, public translate: TranslateService,
    public primeNGConfig: PrimeNGConfig,  private primengConfig: PrimeNGConfig, private api: ApiService) { }



  ngAfterViewInit() {
    /* this.observer.observe(['(max-width: 800px)']).subscribe((res: { matches: any; }) => {
       if (res.matches) {
         this.sidenav.mode = 'over';
         this.sidenav.close();
       } else {
         this.sidenav.mode = 'side';
         this.sidenav.open();
       }
     });*/
  }

  ngOnInit(): void {

    /*this.moduleTake.emit(this.tokenStorageService.getCurrentModule())*/

    this.listNotification()
    this.nbrMessageNonLu()

    this.username = this.tokenStorageService.getUser().username;

    this.status = this.tokenStorageService.getActiveItem()
    this.primengConfig.ripple = true;

    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.tokenStorageService.getUser().username) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username;
      console.log(this.username)
    }

  }



  getMessageriePage() {
    this.nbrMessages = 0
    this.router.navigate(['home/messages'])
  }

  changeLang(lang: string) {
    this.translate.use(lang);
  }

  showDialog() {
    this.display = true
  }
  showNotifiction() {
    this.displayN = true
  }
  message: string = '';
  showDialogError(message: string) {
    this.message = message
    this.displayE = true
  }
  close() {
    this.display = false;
  }
  closeError() {
    this.displayE = false;
  }
  closeNotif() {
    this.displayN = false;
  }

  logout(): void {
    this.deconnexion()
    // window.location.reload()

  }

  getProfilUser() {
    this.router.navigate(['home/profil_user'])
  }

  deconnexion() {
    console.log(this.tokenStorageService.getUser().username)
    // return this.api.userLogout(this.tokenStorageService.getUser().username)
    //   .subscribe((data) => {
    //     this.tokenStorageService.signOut();
    //     this.router.navigate([''])
    //   },
    //     (error) => {
    //       console.log(error)
    //       this.showDialogError(error.error)
    //       this.close()
    //     })
  }



  status: any = 'courrier'
  toggleStatus(val: string) {
    this.status = val;
    this.tokenStorageService.saveActiveItem(val)
  }

  listNotification() {

    // this.api.messageList(this.tokenStorageService.getUser().username, 'M').subscribe(data => {
    //   this.messagesList = data
    //   if (this.messagesList.length >= 1) {
    //     this.showNotifiction()
    //   }

    //   // this.nbrMessages = data.length
    // },
    //   (error) => {
    //     console.log(error)
    //   });

  }

  nbrMessageNonLu() {
    // this.api.nbrMessagesNonLu(this.tokenStorageService.getUser().username).subscribe(data => {
    //   this.nbrMessages = data
    //   console.log(data);
    // },
    //   (error) => {
    //     console.log(error)
    //     // this.showDialogError('Une erreur est survenue lors du chargement des messages')
    //   });
  }

  sidebar = true
  showSidebar() {
    if (this.sidebar) {
      this.sidebar = false
    } else {
      this.sidebar = true
    }
  }


}



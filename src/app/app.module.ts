import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigService } from './services/config.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { EditorModule } from 'primeng/editor';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TabMenuModule } from 'primeng/tabmenu';
import { TreeTableModule } from 'primeng/treetable';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
//import { NgxUploaderDirectiveModule } from 'ngx-uploader-directive';
import { PrimeModule } from './shared/prime.module';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ConfirmationService } from 'primeng/api';
import { AccueilComponent } from './accueil/accueil.component';

import { LoginComponent } from './login/login.component';
import { SplitterModule } from 'primeng/splitter';
import { SplitButtonModule } from 'primeng/splitbutton';

import { QRCodeModule } from 'angularx-qrcode';
import { NgxPrintModule } from 'ngx-print';

import { ExamenComponent } from './components/examen/examen.component';
import { AnnonimatComponent } from './components/annonimat/annonimat.component';
import { AssiduiteComponent } from './components/assiduite/assiduite.component';
import { DevoirComponent } from './components/devoir/devoir.component';
import { NotationComponent } from './components/notation/notation.component';
import { NoteanonymeComponent } from './components/noteanonyme/noteanonyme.component';
import { NoteSyntheseComponent } from './components/notesynthese/notesynthese.component';
import { NotevalidationComponent } from './components/notevalidation/notevalidation.component';
import { NumberInputDirective } from './components/number-input-directive.directive';
import { ProfileComponent } from './components/profile/profile.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { SessionComponent } from './components/session/session.component';
import { SessioncoursComponent } from './components/sessioncours/sessioncours.component';
import { SoutenanceComponent } from './components/soutenance/soutenance.component';
import { WelcomeComponent } from './components/welcome/welcome.component';






export function initConfig(appConfig: ConfigService) {
  return () => appConfig.loadConfig();
}
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, 'assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AccueilComponent,
    SoutenanceComponent,
    DevoirComponent,
    SessionComponent,
    NotationComponent,
    SessioncoursComponent,
    AssiduiteComponent,
    NoteanonymeComponent,
    AnnonimatComponent,
    NoteSyntheseComponent,
    NotevalidationComponent,
    ProfileComponent,
    WelcomeComponent,
    ResetpasswordComponent,
    NumberInputDirective,
    ExamenComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule, HttpClientModule,

    PdfViewerModule,

    PrimeModule,
    DropdownModule,
    MultiSelectModule,
    TabMenuModule, SelectButtonModule, ProgressSpinnerModule,
    ConfirmPopupModule, ButtonModule, InputTextModule,
    TreeTableModule,
    ConfirmDialogModule, DialogModule, EditorModule, OverlayPanelModule, SplitterModule, SplitButtonModule,
    QRCodeModule, NgxPrintModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    DialogService,
    TranslateService,
    ConfirmationService,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [ConfigService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

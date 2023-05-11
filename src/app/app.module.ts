import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigService } from './services/config.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AccueilComponent } from './components/accueil/accueil.component';
import { QuestionProtocoleComponent } from './components/question-protocole/question-protocole.component';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { EditorModule } from 'primeng/editor';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TabMenuModule } from 'primeng/tabmenu';
import { TreeTableModule } from 'primeng/treetable';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { SplitterModule } from 'primeng/splitter';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { NotationComponent } from './components/notation/notation.component';
import { ElementcrutialComponent } from './components/elementcrutial/elementcrutial.component';
import { DomaineComponent } from './components/domaine/domaine.component';
//import { NgxUploaderDirectiveModule } from 'ngx-uploader-directive';
import { PrimeModule } from './shared/prime.module';
import { JustificatifComponent } from './components/justificatif/justificatif.component';
import { ReferenceoaciComponent } from './components/referenceoaci/referenceoaci.component';
import { EvaluationComponent } from './components/evaluation/evaluation.component';


export function initConfig(appConfig: ConfigService) {
  return () => appConfig.loadConfig();
}
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, 'assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    AccueilComponent,
    QuestionProtocoleComponent,
    LoginComponent,
    NotationComponent,
     ElementcrutialComponent,
      DomaineComponent, 
      JustificatifComponent,
      ReferenceoaciComponent,
      EvaluationComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    //  NgxUploaderDirectiveModule,
    BrowserAnimationsModule,
    ReactiveFormsModule, HttpClientModule,

    PdfViewerModule,



    PrimeModule,
    DropdownModule,
    MultiSelectModule,
    TabMenuModule, SelectButtonModule, ProgressSpinnerModule,
    ConfirmPopupModule, ButtonModule, InputTextModule,
    TreeTableModule,
    ConfirmDialogModule, DialogModule, EditorModule,

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

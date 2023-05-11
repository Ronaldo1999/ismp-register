import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginActivateGuard } from './services/login-activate.guard';
import { AccueilComponent } from './components/accueil/accueil.component';
import { QuestionProtocoleComponent } from './components/question-protocole/question-protocole.component';
import { LoginComponent } from './login/login.component';
import { NotationComponent } from './components/notation/notation.component';
import { ElementcrutialComponent } from './components/elementcrutial/elementcrutial.component';
import { DomaineComponent } from './components/domaine/domaine.component';
import { JustificatifComponent } from './components/justificatif/justificatif.component';
import { ReferenceoaciComponent } from './components/referenceoaci/referenceoaci.component';
import { EvaluationComponent } from './components/evaluation/evaluation.component';

const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home', component: MainComponent,
    children: [
      { path: '', component: AccueilComponent },
      { path: 'accueil', component: AccueilComponent },
      { path: 'notation', component: NotationComponent },
      { path: 'ec', component: ElementcrutialComponent },
      { path: 'domaine', component: DomaineComponent },
      { path: 'pq', component: QuestionProtocoleComponent },
      { path: 'just', component: JustificatifComponent },
      { path: 'ref', component: ReferenceoaciComponent },
      { path: 'eva', component: EvaluationComponent }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

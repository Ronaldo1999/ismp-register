import { HttpClient, HttpEvent, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable, of } from 'rxjs';

import { SessionStorageService } from './session-storage.service';
import { Notation } from '../class/notation';
import { QuestionProtocole } from '../class/questionProtocole';
import { Referenceoaci } from '../class/referenceOaci';
import { Domaine } from '../class/domaineAudit';
import { ElementCrutial } from '../class/elementCrutial';
import { FindParam } from '../class/find-param';
import { ResponseFile } from '../class/response-file';
import { Justificatif } from '../class/justificatif';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  urlListNotation = ''
  urlInsertNotation = ''
  urlDeleteNotation = ''
  urlDeleteNotationList = ''
  urlListElement = ''
  urlInsertElement = ''
  urlDeleteElement = ''
  urlDeleteElementList = ''
  urlListDomaine = ''
  urlInsertDomaine = ''
  urlDeleteDomaine = ''
  urlDeleteDomaineList = ''
  urlListReference = ''
  urlInsertReference = ''
  urlDeleteReference = ''
  urlDeleteReferenceList = ''
  urlListQuestion = ''
  urlInsertQuestion = ''
  urlDeleteQuestion = ''
  urlDeleteQuestionList = ''


  urlRefList = '';

  urlPQList = ''
  urlPQInsert = ''
  urlPQdelete = ''


  urlJustificatifList = ''
  urlJustificatifInsert = ''
  urlJustificatifdelete = ''


  urlFichierVisibilite: string = ''
  urlFichierUpdate = ''
  urlFichierList = ''
  urlFichierTempList = ''
  urlFichierFind = ''
  urlFichierUpload = ''
  urlFichierDelete = ''
  urlFichierDownload = ''

  constructor(private http: HttpClient, private sessionService: SessionStorageService, private appConfigService: ConfigService) {
    const urlserveur = this.appConfigService.getConfig().serverIP;



    /* Notations */
    this.urlListNotation = urlserveur + 'notation/list';
    this.urlInsertNotation = urlserveur + 'notation/insert';
    this.urlDeleteNotation = urlserveur + 'notation/delete/';
    this.urlDeleteNotationList = urlserveur + 'notation/deleteMultiple';

    /* Elements */
    this.urlListElement = urlserveur + 'elementCrutial/list';
    this.urlInsertElement = urlserveur + 'elementCrutial/insert';
    this.urlDeleteElement = urlserveur + 'elementCrutial/delete/';
    this.urlDeleteElementList = urlserveur + 'elementCrutial/deleteList';

    /* domaines */
    this.urlListDomaine = urlserveur + 'domaineAudit/list';
    this.urlInsertDomaine = urlserveur + 'domaineAudit/insert';
    this.urlDeleteDomaine = urlserveur + 'domaineAudit/delete/';
    this.urlDeleteDomaineList = urlserveur + 'domaineAudit/deleteList';

    /* references */
    this.urlListReference = urlserveur + 'referenceoaci/list';
    this.urlInsertReference = urlserveur + 'referenceoaci/insert';
    this.urlDeleteReference = urlserveur + 'referenceoaci/delete/';
    this.urlDeleteReferenceList = urlserveur + 'referenceoaci/deleteList';

    /* question protocole*/
    this.urlListQuestion = urlserveur + 'referenceoaci/list';
    this.urlInsertQuestion = urlserveur + 'referenceoaci/insert';
    this.urlDeleteQuestion = urlserveur + 'referenceoaci/delete/';
    this.urlDeleteQuestionList = urlserveur + 'referenceoaci/deleteList';


    this.urlRefList = urlserveur + 'referenceoaci/list'

    this.urlPQList = urlserveur + 'pq/list'
    this.urlPQInsert = urlserveur + 'pq/insert'
    this.urlPQdelete = urlserveur + 'pq/delete/'

    this.urlJustificatifList = urlserveur + 'justificatif/list'
    this.urlJustificatifInsert = urlserveur + 'justificatif/insert'
    this.urlJustificatifdelete = urlserveur + 'justificatif/delete/'





    this.urlFichierVisibilite = urlserveur + 'fichier/visibilite'
    this.urlFichierUpdate = urlserveur + 'fichier/update'
    this.urlFichierList = urlserveur + 'fichier/list'
    this.urlFichierTempList = urlserveur + 'fichier/tempList'
    this.urlFichierFind = urlserveur + 'fichier/find/'
    this.urlFichierUpload = urlserveur + 'fichier/upload'
    this.urlFichierDelete = urlserveur + 'fichier/delete/'
    this.urlFichierDownload = urlserveur + 'download/77d86ad416fdddab96c3cfd0930/'






  }






  /* Notation */
  getAllNotation() {
    return this.http.get(this.urlListNotation);
  }

  insertNotation(data: Notation) {
    return this.http.post(this.urlInsertNotation, data);
  }

  deleteNotation(id: any) {
    return this.http.delete(this.urlDeleteNotation + id);
  }
  deleteNotationList(list: any[]) {
    return this.http.post(this.urlDeleteNotationList, list);
  }

  /* Elements */
  getAllElement() {
    return this.http.get(this.urlListElement);
  }

  insertElement(data: ElementCrutial) {
    return this.http.post(this.urlInsertElement, data);
  }

  deleteElement(id: any) {

    return this.http.delete(this.urlDeleteElement + id);

  }
  deleteElementList(list: any[]) {
    return this.http.post(this.urlDeleteElementList, list);
  }

  /* domaines */
  getAllDomaine() {
    return this.http.get(this.urlListDomaine);
  }

  insertDomaine(data: Domaine) {
    return this.http.post(this.urlInsertDomaine, data);
  }

  deleteDomaine(id: any) {
    return this.http.delete(this.urlDeleteDomaine + id);
  }
  deleteDomaineList(list: any[]) {
    return this.http.post(this.urlDeleteDomaineList, list);
  }

  /* references */
  getAllReference() {
    return this.http.get(this.urlListReference);
  }

  insertReference(data: Referenceoaci) {
    return this.http.post(this.urlInsertReference, data);
  }

  deleteReference(id: any) {
    return this.http.delete(this.urlDeleteReference + id);
  }
  deleteReferenceList(list: any[]) {
    return this.http.post(this.urlDeleteReferenceList, list);
  }


  /* references */
  getAllQuestion() {
    return this.http.get(this.urlListQuestion);
  }

  insertQuestion(data: QuestionProtocole) {
    return this.http.post(this.urlInsertQuestion, data);
  }

  deleteQuestion(id: any) {
    return this.http.delete(this.urlDeleteQuestion + id);
  }
  deleteQuestionList(list: any[]) {
    return this.http.post(this.urlDeleteQuestionList, list);
  }







  ////////////////////////////////////
  ////////////////////////////////////
  ////////////mes services///////////
  ////////////////////////////////////
  ////////////////////////////////////



  referenceList() {
    return this.http.get(this.urlRefList);
  }


  pqList(fparam: FindParam) { return this.http.post(this.urlPQList, fparam); }

  pqInsert(data: QuestionProtocole) { return this.http.post(this.urlPQInsert, data); }

  pqDelete(id: any) { return this.http.delete(this.urlPQdelete + id); }




  justificatifListBy(id: string) { return this.http.get(this.urlJustificatifList + '/' + id); }

  justificatifList() { return this.http.get(this.urlJustificatifList); }

  justificatifInsert(data: Justificatif) { return this.http.post(this.urlJustificatifInsert, data); }

  justificatifDelete(id: any) { return this.http.delete(this.urlJustificatifdelete + id); }









  upload(file: File, login: string, type: any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('id', login);
    formData.append('file', file);
    formData.append('type', type);

    const req = new HttpRequest('POST', this.urlFichierUpload, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    console.log(req);


    return this.http.request(req);
  }

  getTempFiles() {
    return this.http.get<ResponseFile[]>(this.urlFichierTempList);
  }

  getFiles() {
    return this.http.get<ResponseFile[]>(this.urlFichierList);
  }

  getFilesByJust(id: string) {
    return this.http.get<ResponseFile[]>(this.urlFichierList + '/' + id);
  }

  getPieceVisibilite(id: string) {
    return this.http.get<any>(this.urlFichierVisibilite + id);
  }

  getFile(id: string) {
    const httpOptions = {
      //responseType: 'arraybuffer' as 'json'
      responseType: 'json'        //This also worked
    };
    return this.http.get<any>(this.urlFichierFind + id);
  }


  downloadFile(id: string): Observable<Blob> {
    const httpOptions = {
      responseType: 'blob' as 'json'
    };
    return this.http.get<Blob>(this.urlFichierDownload + id, httpOptions);
  }


  deleteFile(id: string): Observable<any> {
    return this.http.delete(this.urlFichierDelete + id);
  }


  updateFiles(filedb: ResponseFile): Observable<any> {
    return this.http.post(this.urlFichierUpdate, filedb);
  }


}

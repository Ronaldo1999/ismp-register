export class Justificatif{
    justificatifID!: string;
    questionProtocoleID!: string;
    dateCreation!:Date;
    type!:string;
    description!:string;
    titre!:string;
    user_update !: string;
    nbfichier !: number;
    fichierID: string[] = []
}
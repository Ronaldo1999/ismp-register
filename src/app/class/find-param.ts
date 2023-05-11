export class FindParam {
    userID!: string
    organisationID!: string
    libelleOrganisation!: string
    
    questionProtocoleID!: string;
    referenceoaciID!: string;
    elementCrutialID!: string;
    domaineID!: string;
    noteID!: string;
    dateMax!: Date
    dateMin!: Date
    objet!: string
    autre!: string

    constructor(_org: string, _login: string) { this.userID = _login ; this.organisationID = _org }
}
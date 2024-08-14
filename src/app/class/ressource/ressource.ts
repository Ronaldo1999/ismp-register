export class RessourceSimple {
    id!: string;
    idue!: number;
    idregroupements!: number;
    idparcours!: number;
    idperiode!: number;
    user!: string;
    description!: string;
    nomfichier!: string;
    cheminfichier!: string;
    forall!: number;
    typeressources!: number;
    lien!: string;
    typeressouce!: string;
    delai!: string;
    created_by!: string;
    created_at!: string;
    libelleFr!: string;
}
export class Ressource {
    id!: string;
    idressource!: string;
    courid!: number;
    idue!: number;
    idregroupements!: number;
    idparcours!: number;
    idperiode!: number;
    created_by!: string;
}

export class GlobalRessource {
    id!: string;
    idue!: number;
    idressource!: string;
    idregroupements!: number;
    idparcours!: number;
    idperiode!: number;
    created_by!: string;
    ressources!: Ressource[];
}

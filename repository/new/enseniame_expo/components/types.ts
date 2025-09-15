class User {
    mail: string;
    username: string;
    hashed_password: string;

    constructor(mail:string,name: string,pass:string){
        this.mail=mail;
        this.username=name;
        this.hashed_password=pass;
    }

}
class Alumno extends User {

    constructor(mail:string,name: string,pass:string){
        super(mail,name,pass)
    }
}

class Profesor extends User  {
    institution: string
    is_prof: true

    constructor(mail:string,name: string,pass:string, institucion:string){
        super(mail,name,pass);
        this.is_prof=true;
        this.institution=institucion;
    }
} 
interface Logged_Profesor extends Profesor {id:number}

export type {User, Logged_Profesor, Alumno, Profesor}
import { router } from "expo-router";

abstract class User {
    mail: string;
    username: string;
    hashed_password: string;

    constructor(mail:string,name: string,pass:string){
        this.mail=mail;
        this.username=name;
        this.hashed_password=pass;
    }
    abstract goHome():void;

}
class Alumno extends User {

    constructor(mail:string,name: string,pass:string){
        super(mail,name,pass)
    }
    goHome(): void {
        router.push('/tabs/HomeStudent');
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

    goHome(): void {
        router.push('/tabs/HomeTeacher');
    }
} 

abstract class Logged_User {
    mail: string;
    username: string;
    hashed_password: string;
    id:number;
    is_prof: boolean;
    institution: string;

    constructor(mail:string,name: string,pass:string,id:number){
        this.mail=mail;
        this.username=name;
        this.hashed_password=pass;
        this.id=id;
        this.is_prof=false;
        this.institution=""
    }
    abstract goHome():void;

}
class Logged_Profesor extends Logged_User {
    institution: string;
    is_prof: true;

    constructor(mail:string,name: string,pass:string, institucion:string,id:number){
        super(mail,name,pass,id);
        this.institution=institucion;
        this.is_prof=true;
    }

    goHome(): void {
        router.push('/tabs/HomeTeacher');
    }

}

class Logged_Alumno extends Logged_User {

    constructor(mail:string,name: string,pass:string,id:number){
        super(mail,name,pass,id);
    }
    goHome(): void {
            router.push('/tabs/HomeStudent');
    }
}

interface Categoria {
    id: number;
    nombre: string;
}

interface Senia {
  id: number;
  significado: string;
  video_url: string;
  id_autor: number;
  categoria: number | undefined
}

export {User,Logged_User, Logged_Profesor, Alumno, Profesor, Logged_Alumno, Senia, Categoria}
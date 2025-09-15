interface User {mail:string,username:string,hashed_password:string,}
interface Logged_User extends User {id:number}
interface Profesor extends User  {institution: string, is_prof: true} 
interface Logged_Profesor extends Profesor {id:number}

export type {User, Logged_Profesor, Logged_User, Profesor}
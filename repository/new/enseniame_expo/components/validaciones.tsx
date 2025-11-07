

const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return {msj:'La contraseña debe tener al menos 8 caracteres y un carácter especial',status:false}
    } else {
        return {msj:"",status:true}
    }
};


const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {msj:'El formato del email no es válido',status:false}
    } else {
        return {msj:"",status:true}
    }
};

const validateInstitution = (institucion: string)=>{
    return  institucion!=""
}

const get_antiguedad = (date: string)=>{
    const ahora = new Date();
    const antes = new Date(date)
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = ahora.getTime() - antes.getTime();

    if (elapsed < msPerMinute) {
         return 'Hace '+ Math.round(elapsed/1000) + ' segundos';   
    }

    else if (elapsed < msPerHour) {
         return 'Hace '+Math.round(elapsed/msPerMinute) + ' minutos';   
    }

    else if (elapsed < msPerDay ) {
         return 'Hace '+ Math.round(elapsed/msPerHour ) + ' horas';   
    }

    else if (elapsed < msPerMonth) {
        return 'Hace ' + Math.round(elapsed/msPerDay) + ' días';   
    }

    else if (elapsed < msPerYear) {
        return 'Hace ' + Math.round(elapsed/msPerMonth) + ' meses';   
    }

    else {
        return 'Hace ' + Math.round(elapsed/msPerYear ) + ' años';   
    }
  }
export {validatePassword, validateEmail, validateInstitution, get_antiguedad}
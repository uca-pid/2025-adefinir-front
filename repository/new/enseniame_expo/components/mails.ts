import { supabase } from "@/lib/supabase";
import { EmailOtpType } from "@supabase/supabase-js";
import { error_alert, success_alert } from "./alert";
import { send, EmailJSResponseStatus } from '@emailjs/react-native';

const enviar_mail_recuperacion = async (mail:string, pass: string)=>{
    try {
      await send(  'service_81v1jae',  'template_uyw1fhf',
        {
          email:mail,
          passcode: pass,
        },
        {
          publicKey: 'm53z-wmq03M6W3J5B',
        },
        
      );

      console.log('SUCCESS!');
      success_alert("Mail enviado")
    } catch (err) {
      if (err instanceof EmailJSResponseStatus) {
        console.log('EmailJS Request Failed...', err);
      }

      console.log('ERROR', err);
    }
    
}

export {enviar_mail_recuperacion}

import { Injectable } from "@nestjs/common";

@Injectable()
export class VerificationService{
    isValidEmail(email){
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
    }
    isValidPassword(password){
        const hasNumber = /\d/.exec(password)?.length > 0;
        const hasUppercase = /A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z/.exec(password)?.length > 0;
        const hasLowercase = /a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z/.exec(password)?.length > 0;
        const hasSpecialCharacter = /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\=|\+|\[|\{|\]|\}|\\|\||\;|\:|\'|\"|\,|\<|\.|\>|\/|\?/.exec(password)?.length > 0;
        const isProperLength = password.length >= 10;

        return hasNumber && hasUppercase && hasLowercase && hasSpecialCharacter && isProperLength;
    }
}
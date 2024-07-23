import { FormControl, ValidationErrors } from "@angular/forms";

export class ShopValidators {

    // Whitespace Validation
    static notOnlyWhitespace(control: FormControl): ValidationErrors | null {
        // Check if string only contains whitespaces
        if((control.value != null) && (control.value.trim().length === 0)) {
    
            // Invalid, Error Is There So Returning An Error Object
            return { "notOnlyWhitespace": true};
        }
        else {

            // Valid So no error so returning null
        return null;
        }
    }
}

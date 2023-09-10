export const isStrongPassword = ( password ) => {
    

    const passwordTest = {
        minLength: 8,
        lowercase: /[a-z]/,
        uppercaseRegex: /[A-Z]/,
        numberRegex: /[0-9]/,
        specialCharRegex: /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/
    };
    
    let length = false;
    let lowercase = false;
    let uppercase = false;
    let number = false;
    let specialChar = false;

    if ( password.length >= passwordTest.minLength ) {
        length = true;
    }
    if ( passwordTest.lowercase.test( password ) ) {
        lowercase = true;
    }
    if ( passwordTest.uppercaseRegex.test( password ) ) {
        uppercase = true;
    }
    if ( passwordTest.numberRegex.test( password ) ) {
        number = true;
    }
    if ( passwordTest.specialCharRegex.test( password ) ) {
        specialChar = true;
    }

    return {
        length,
        lowercase,
        uppercase,
        number,
        specialChar,
    }

};


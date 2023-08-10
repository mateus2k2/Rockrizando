const validatePasswordPromise = (_, value) => {
    if (validatePassword(value)){
    return Promise.resolve();
    }

    return Promise.reject(
    'Password must be at least 6 characters long, \n' +
    'contain at least one special character (@ or #), \n' +
    'one uppercase character, and one number.'
    );
};

const validadeEmailPromise = (_, value) => {
    if (validadeEmail(value)){
        return Promise.resolve();
    }

    return Promise.reject(
        'Please input a valid email address.'
    );
}

const validadeNamePromise = (_, value) => {
    if (validateName(value)){
        return Promise.resolve();
    }

    return Promise.reject(
        'Name must be at least 6 characters long, \n' +
    'Not contain at least one special character (@ or #), \n' 
    );
}

const validatePassword = (value) => {
    // const minLengthRegex = /^.{6,}$/;
    // const specialCharRegex = /[@#]/;
    // const uppercaseRegex = /[A-Z]/;
    // const numberRegex = /[0-9]/;

    // return (
    // minLengthRegex.test(value) &&
    // specialCharRegex.test(value) &&
    // uppercaseRegex.test(value) &&
    // numberRegex.test(value)
    // )
    return true
};

const validateName = (value) => {
    // const minLengthRegex = /^.{6,}$/;
    // not const specialCharRegex = /[@#]/;
    // const uppercaseRegex = /[A-Z]/;
    // not const numberRegex = /[0-9]/;

    // return (
    // minLengthRegex.test(value) &&
    // specialCharRegex.test(value) &&
    // uppercaseRegex.test(value) &&
    // numberRegex.test(value)
    // )
    return true
};

const validadeEmail = (value) => {
    // const emailRegex = /^\S+@\S+\.\S+$/;
    
    // return (emailRegex.test(value))
    return true
}

export { validatePasswordPromise,validadeNamePromise, validadeEmailPromise, validatePassword, validadeEmail }

class Validators {
    static required(field, value) {
        return { error: (value === '' || value === null), message: `${field} is required` }
    }

    static requiredTrue(field, value) {
        return { error: (value === false ? true : false), message: `${field} is require to be true` }
    }

    static min(field, value, min) {
        return { error: (value <= min), message: `${field} cannot be less than ${min}` }
    }

    static max(field, value, max) {
        return { error: (value >= max), message: `${field} cannot be more than ${max}` }
    }
}

export function handleValidate(validatorObj) {
    const states = [];
    Object.keys(validatorObj).forEach((type) => {
        states.push(Validators[type]);
    });

    return states;
}

export function setFormError(formField, error) {
    const input = formField.querySelector('input') || formField.querySelector('select');
    const errorLabel = formField.getElementsByClassName('error-label')[0];

    if (error) {
        input.classList.add('invalid-control');
        errorLabel.classList.add('invalid-feedback')
        errorLabel.classList.remove('valid-feedback');
        errorLabel.textContent = error.message;
    } else {
        input.classList.remove('invalid-control');
        errorLabel.classList.remove('invalid-feedback');
        errorLabel.classList.add('valid-feedback');
        errorLabel.textContent = null;
    }
}
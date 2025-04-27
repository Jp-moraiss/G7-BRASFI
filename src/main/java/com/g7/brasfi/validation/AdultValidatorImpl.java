package com.g7.brasfi.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.time.LocalDate;
import java.time.Period;

public class AdultValidatorImpl implements ConstraintValidator<AdultValidator, LocalDate> {

    @Override
    public boolean isValid(LocalDate birthDate, ConstraintValidatorContext context) {
        if (birthDate == null) {
            return false;
        }
        
        if (birthDate.isAfter(LocalDate.now())) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("Data de nascimento não pode ser no futuro")
                    .addConstraintViolation();
            return false;
        }
        return Period.between(birthDate, LocalDate.now()).getYears() >= 18;
    }
}


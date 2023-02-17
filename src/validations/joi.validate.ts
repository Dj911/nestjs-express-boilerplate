import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import Joi, { ObjectSchema, ValidationResult } from "joi"
import { UserLoginBodyDto, UserSignupBodyDto } from "../user/dto/body.dto"
import { login_schema, signup_schema } from "./joi.schema"

type ValidateData = {
    status: boolean
    error?: string
}

const validateData = (schema: ObjectSchema, data: object): ValidateData => {
	const validate: ValidationResult = schema.validate(data)
	if (validate.error) {
		return {
			status: false,
			error: validate.error?.details[0]?.message.replace(/"/g, '')
		}
	} else {
		return {
			status: true
		}
	}
}

/* 
//? If u want to add Joi manually inside service use this
export const signup_validation = (data: UserSignupBodyDto): ValidateData =>{
    return validateData(signup_schema,data)
}

export const login_validation = (data: UserLoginBodyDto): ValidateData => {
    return validateData(login_schema,data)
} */


@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value);
    if (error) {
      throw new BadRequestException(error.details[0]?.message.replace(/"/g, ''));
    }
    return value;
  }
}

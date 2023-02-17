import Joi from "joi"
import { Role } from "../helpers/constant"

export const signup_schema = Joi.object({
    password: Joi.string().required(),
    username: Joi.string().required(),
    name: Joi.string().required(),
    roles: Joi.array().items(Joi.string().valid(...Object.keys(Role))).optional()
})

export const login_schema = Joi.object({
    password: Joi.string().required(),
    username: Joi.string().required()
})
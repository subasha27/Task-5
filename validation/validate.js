const joi = require('@hapi/joi');


const adminCreateSchema = joi.object({
    name: joi.string().min(3).max(15).required(),
    mail: joi.string().email().required(),
    password: joi.string().min(8).max(15).required()
})

const adminLoginSchema = joi.object({
    mail: joi.string().email().required(),
    password: joi.string().min(8).max(15).required()
})


module.exports = {
    adminCreateSchema,
    adminLoginSchema,
}
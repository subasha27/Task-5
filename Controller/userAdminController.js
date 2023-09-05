const Admin = require("../model/adminModel");
const { adminCreateSchema, adminLoginSchema } = require("../validation/validate");
const jwt = require("jsonwebtoken");
const secretKey = process.env.secretKey

const adminCreate = async (req, res) => {
    try {
        const validation = await adminCreateSchema.validate(req.body);
        if (validation.error) return res.status(200).send({ message: validation.error.details[0].message })

        const existingAdmin = await Admin.findOne({ where: { mail: req.body.mail } })
        if (existingAdmin) return res.status(200).send({ message: "Admin Already exists" })

        const adminDetails = {
            name: req.body.name,
            mail: req.body.mail,
            password: req.body.password
        };

        const adminData = await Admin.create(adminDetails)
        const id = adminData.id;
        return res.status(200).send({ message: "Admin Created Successfully", id })

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Server Error" })
    }
}


const adminLogin = async (req, res) => {
    try {
        const loginDetail = req.body;
        const loginValidation = adminLoginSchema.validate(loginDetail);
        if (loginValidation.error) return res.status(200).json({ message: loginValidation.error.details[0].message })

        const adminCheck = await Admin.findOne({ where: { id: req.params.id } });
        if (!adminCheck) return res.status(404).json({ message: "Admin Not FoundUnauthorised Entry" });
        else {
            if (adminCheck.mail != req.body.mail) {
                return res.status(400).json({ message: "Mail Id Authentication Error" })
            }
            if (adminCheck.password == req.body.password) {
                const token = jwt.sign({ id: req.params.id }, secretKey)
                return res.status(200).json({ message: "Admin login Success", token });
            } else {
                return res.status(400).json({ message: "Invalid Password" })
            }
        }

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: "Server Error" })
    }
}



module.exports = {
    adminCreate,
    adminLogin

}
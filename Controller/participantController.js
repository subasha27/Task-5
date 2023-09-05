const { Participant } = require("../model/participantsModel");
const { adminCreateSchema, adminLoginSchema } = require("../validation/validate");
const jwt = require("jsonwebtoken");
const userSecretKey = process.env.userSecretKey;

const participantCreate = async (req, res) => {
    try {
        const validation = await adminCreateSchema.validate(req.body);
        if (validation.error) return res.status(200).send({ message: validation.error.details[0].message })

        const existingAdmin = await Participant.findOne({ where: { mail: req.body.mail } })
        if (existingAdmin) return res.status(200).send({ message: "Participant Already exists" })

        const adminDetails = {
            name: req.body.name,
            mail: req.body.mail,
            password: req.body.password
        };

        const adminData = await Participant.create(adminDetails)
        const id = adminData.id;
        return res.status(200).send({ message: "Participant Created Successfully", id })

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Server Error" })
    }
}


const participantLogin = async (req, res) => {
    try {
        const loginDetail = req.body;
        const loginValidation = adminLoginSchema.validate(loginDetail);
        if (loginValidation.error) return res.status(200).json({ message: loginValidation.error.details[0].message })

        const participantCheck = await Participant.findOne({ where: { id: req.params.id } });
        if (!participantCheck) return res.status(404).json({ message: "Participant Not Found" });
        else {
            if (participantCheck.mail != req.body.mail) {
                return res.status(400).json({ message: "Mail Id Authentication Error" })
            }
            if (participantCheck.password == req.body.password) {
                const token = jwt.sign({ id: req.params.id }, userSecretKey)
                return res.status(200).json({ message: "Participant login Success", token });
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
    participantCreate,
    participantLogin

}
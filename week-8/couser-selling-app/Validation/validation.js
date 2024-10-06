const { z } = require("zod");


const userValidation = (req, res) => {

    const userBodyFormat = z.object({
        email: z.string().min(3).max(40).email("email is not in correct format"),
        password: z.string().min(4).max(20),
        name: z.string().optional()
    })

    const bodyFomated = userBodyFormat.safeParse(req.body);

    if (!bodyFomated.success) {
        return res.json({ message: bodyFomated.error.errors })
    }
}

module.exports = {
    userValidation
}
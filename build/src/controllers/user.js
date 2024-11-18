"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../services/user"));
const nodemailer_1 = require("../libs/nodemailer");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class userController {
    async findUser(req, res) {
        try {
            const userLocals = res.locals.verifyingUser;
            const userData = await user_1.default.FindUser(userLocals.id);
            if (!userData)
                throw new Error("User not found");
            res.send(userData);
        }
        catch (err) {
            res.status(404).json({ error: 'User not found' });
            ;
        }
    }
    async findUserID(req, res) {
        try {
            const userLocals = res.locals.verifyingUser;
            const userData = await user_1.default.FindOtherUser(parseInt(req.params.id), userLocals.id);
            if (!userData)
                throw new Error("User not found");
            res.send(userData);
        }
        catch (err) {
            res.status(404).json({ error: 'User not found' });
            ;
        }
    }
    async registerUser(req, res) {
        /*  #swagger.requestBody = {
               required: true,
               content: {
                   "multipart/form-data": {
                       schema: {
                           $ref: "#/components/schemas/registerSchema"
                       }
                   }
               }
           }
       */
        try {
            const dataCreated = await user_1.default.RegisterUser(req.body);
            const token = jsonwebtoken_1.default.sign(dataCreated.id.toString(), process.env.JWT_SECRET);
            const fullUrl = req.protocol + "://" + req.get("host");
            const info = await nodemailer_1.transporter.sendMail({
                from: `Circle <${process.env.EMAIL_ADDRESS}>`, // sender address
                to: req.body.email, // list of receivers
                subject: "Verification Link", // Subject line
                html: `
            <div style="background-color: #252525; margin: auto; width: 50%; text-align: center; padding: 1rem; border-radius: 12px; font-family: Arial, Helvetica, sans-serif;">
                <H1 style="color: lime; font-weight: bold;">Circle App</H1>
                <p style="color: white; font-size: 0.8rem;">Welcome to Circle App!<br> Click the button below to verify your account</p>
                <Button style="background-color: green; border: none; border-radius: 12px; height: 40px; margin: 1rem;"><a style="text-decoration: none; color: white; margin: 0.5rem; font-size: 1rem;" href="${fullUrl}/api/v1/verify-email/${token}">Verify</a></Button>
                <p style="color: white; font-size: 0.8rem;">Please ignore this message if you feel that you are not registering to our services.</p>
                <p style="color: white; font-size: 0.8rem; margin-top: 0.33rem;"> Thank you for using our services.</p>
            </div>
            `, // html body
            });
            await user_1.default.createVerification(token, "EMAIL");
            res.status(201).json({
                stats: "user created",
                email: dataCreated.email,
                smtp: info
            });
        }
        catch (err) {
            res.status(400).send(err.message + ", data has not been saved");
        }
    }
    async loginUser(req, res) {
        /*  #swagger.requestBody = {
               required: true,
               content: {
                   "multipart/form-data": {
                       schema: {
                           $ref: "#/components/schemas/loginSchema"
                       }
                   }
               }
           }
       */
        try {
            const userData = await user_1.default.LoginUser(req.body);
            res.status(200).json({
                user: userData,
                message: "login success"
            });
        }
        catch (err) {
            res.status(400).send(err + ", login failed");
        }
    }
    async verifyEmail(req, res) {
        try {
            const token = req.params.token;
            console.log(token);
            await user_1.default.verify(token);
            const frontendUrl = process.env.FRONTEND_URL;
            res.redirect(`${frontendUrl}/login`);
        }
        catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    }
    async check(req, res) {
        try {
            res.json(res.locals.verifyingUser);
        }
        catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    }
    async updateUser(req, res) {
        /*  #swagger.requestBody = {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            $ref: "#/components/schemas/registerSchema"
                        }
                    }
                }
            }
        */
        try {
            try {
                const body = {
                    ...req.body,
                    photo_profile: (req.file ? req.file.path : null),
                };
                const userData = res.locals.verifyingUser;
                const dataUpdated = await user_1.default.UpdateProfile(userData.id, body);
                res.status(201).json({
                    stats: "data updated",
                    email: dataUpdated.email
                });
            }
            catch (createErr) {
                res.status(500).send({ error: 'Create User error', details: createErr });
            }
        }
        catch (err) {
            res.status(400).send({ error: 'Create User error', message: err });
        }
    }
    async deleteUser(req, res) {
        /*  #swagger.parameters['userid'] = {
            description: 'id for user (int)'
        } */
        try {
            const idUser = parseInt(req.params.id);
            const userData = await user_1.default.DeleteUser(idUser);
            res.status(201).json({
                stats: "data deleted",
                email: userData.email
            }).send;
        }
        catch (err) {
            res.sendStatus(400);
        }
    }
    async requestPassword(req, res) {
        /*  #swagger.requestBody = {
               required: true,
               content: {
                   "multipart/form-data": {
                       schema: {
                           $ref: "#/components/schemas/requestPasswordSchema"
                       }
                   }
               }
           }
       */
        try {
            const email = req.body.email;
            const userData = await user_1.default.checkEmail(email);
            if (!userData)
                throw new Error("User for password reset not found");
            const token = jsonwebtoken_1.default.sign({ id: userData.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const fullUrl = process.env.FRONTEND_URL;
            const info = await nodemailer_1.transporter.sendMail({
                from: `Circle <${process.env.EMAIL_ADDRESS}>`, // sender address
                to: req.body.email, // list of receivers
                subject: "Reset Password Link", // Subject line
                html: `<div style="background-color: #252525; margin: auto; width: 50%; text-align: center; padding: 1rem; border-radius: 12px; font-family: Arial, Helvetica, sans-serif;">
                <H1 style="color: lime; font-weight: bold;">Circle App</H1>
                <p style="color: white; font-size: 0.8rem;">Welcome to Circle App!<br> Click the button below to change your password</p>
                <Button style="background-color: green; border: none; border-radius: 12px; height: 40px; margin: 1rem;"><a style="text-decoration: none; color: white; margin: 0.5rem; font-size: 1rem;" href="${fullUrl}/reset-password/${token}">Change Password</a></Button>
                <p style="color: white; font-size: 0.8rem;">Please ignore this message if you feel that you are not registering to our services.</p>
                <p style="color: white; font-size: 0.8rem; margin-top: 0.33rem;"> Thank you for using our services.</p>
            </div>`, // html body
            });
            res.status(201).json({
                stats: "user created",
                email: userData.email,
                smtp: info
            }).send;
        }
        catch (err) {
            res.sendStatus(400);
        }
    }
    async resetPassword(req, res) {
        /*  #swagger.requestBody = {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            $ref: "#/components/schemas/resetPasswordSchema"
                        }
                    }
                }
            }
        */
        try {
            const token = req.params.token;
            const verify = await jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (!verify)
                throw new Error("Token link error please request again");
            console.log(verify.id);
            const resetedPassword = await user_1.default.ChangePassword(parseInt(verify.id), req.body.password);
            if (!resetedPassword)
                throw new Error("Reset password error");
            const fullUrl = req.protocol + "://" + req.hostname + ":" + process.env.FRONTEND_PORT;
            res.status(201).json({
                stats: "Password sucessfully reset!",
                user_id: verify.id
            }).send;
        }
        catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    }
}
exports.default = new userController();
//# sourceMappingURL=user.js.map
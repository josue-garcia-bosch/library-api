import jwt from "jsonwebtoken";
import config from "../../modules/config";
import * as userService from "../../domains/user/service/user.service"

export const authorizedBy = async (req, res, next) => {
    let bearerHeader = req.headers["authorization"];

    if (!bearerHeader) {
        return res.status(401).json({ message: "send authorization" })
    }

    const token = bearerHeader.split(' ')[1];
    if (!token) return res.status(403).json({ message: "No bearer format in token provided" });

    try {
        const decoded = jwt.verify(token, config.SECRET);
        req.userId = decoded.id;
        const user = await userService.getUser(req.userId);
        if (!user) 
            return res.status(401).json({ message: "Not authorized" });
        req.user = user
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized!" });
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        const role = req.user.role;

        if (role.name === "admin") {
            console.log("is admin user")
            next();
            return;
        }

        return res.status(403).json({ message: "Require Admin Role!" });
    } catch (error) {
        console.error(error)
        return res.status(401).send({ message: error });
    }
};
import { body } from "express-validator";
import UserModel from "../models/User.model.js";


export const validateSignup=[
    body('username')
    .notEmpty().withMessage('Username is required')
    .trim()
    .isLength({min:3}).withMessage('Username must be at least 3 characters')
    .custom(async username => {
        const user = await UserModel.findOne({username});
        if(user) throw new Error('Username already in use');
    }),

    body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail()
    .custom(async email => {
        const user = await UserModel.findOne({email});
        if(user) throw new Error('Email already in use');
    }),

    body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
];

export const validateLogin = [
    body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

    body('password')
    .notEmpty().withMessage('Password is required')
]


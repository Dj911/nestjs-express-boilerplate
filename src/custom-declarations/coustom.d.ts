// To use req.user without error for Typescript
declare namespace Express {
    export interface Request {
       user?: any
    }
 }
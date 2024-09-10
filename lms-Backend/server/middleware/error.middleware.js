// const { stack } = require("../app")

const errorMiddleware = (err,req,res,next) =>{
      err.statusCode = err.statusCode || 500;
      err.message = err.message || "something went wrong!";

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        stack: err.stack
    })
}

// module.exports = errorMiddleware;
export default errorMiddleware;
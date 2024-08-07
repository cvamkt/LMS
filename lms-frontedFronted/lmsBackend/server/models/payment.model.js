// const { model, Schema } = require('mongoose');
import { model, Schema } from 'mongoose';

const paymentSchema = new Schema({
    razorpay_payment_id: {
        type: String,
        required: true
    },
    razorpay_subscription_id: {
        type: String,
        required: true
    },
    razorpay_signature: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Payment = model('payment', paymentSchema);

// module.exports = payment;
export default Payment;
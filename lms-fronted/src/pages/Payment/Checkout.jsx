import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import { getRazorPayId, purchaseCourseBundle, verifyUserPayment } from "../../Redux/Slices/RazorpaySlice";
import toast from "react-hot-toast";
import HomeLayout from "../../Layout/HomeLayout";
import { BiRupee } from "react-icons/bi";

function Checkout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const  state  = useSelector((state)=> state);
    const { courseId } = useParams();
    const razorPayKey = useSelector((state) => state?.razorPay?.key);
    const subscription_id = useSelector((state) => state?.razorPay?.subscription_id);
    // const isPaymentVerified = useSelector((state) => state?.razorpay?.isPaymentVerified);
    const userData = useSelector((state) => state?.auth?.data);
console.log("RAJYA",state);
// console.log();

console.log("chhota lauda",userData);


    const paymentDetails = {
        razorpay_payment_id: "",
        razorpay_subscription_id: "",
        razorpay_signature: ""
    };

    async function handleSubscription(e) {
        e.preventDefault();
        console.log("RazorPay Key:", razorPayKey);
        console.log("Subscription ID:", subscription_id);
        if (!razorPayKey || !subscription_id) {
            toast.error("Something went wrong");
            return;
        }
        const option = {
            key: razorPayKey,
            subscription_id: subscription_id,
            name: "Coursify Pvt. Ltd.",
            description: "Subscription",
            theme: {
                color: '#F37254'
            },
            prefill: {
                email: userData.email,
                name: userData.fullName
            },
            method: {
                netbanking: true,
                card: true,
                upi: true,
                wallet: true,
                qr: true
            },
            handler: async function (response) {
                paymentDetails.courseId = courseId
                paymentDetails.razorpay_payment_id = response.razorpay_payment_id;
                paymentDetails.razorpay_signature = response.razorpay_signature;
                paymentDetails.razorpay_subscription_id = response.razorpay_subscription_id;

                toast.success("Payment Successful");

                const res = await dispatch(verifyUserPayment(paymentDetails));
                console.log("verify :", res);
                res?.payload?.success ? navigate("/checkout/success") : navigate("/checkout/failed");
            }
        };

        const paymentObject = new window.Razorpay(option);
        paymentObject.open();
    }

    // useEffect(() => {
    //     const load = async () => {
    //         const razorPayKeyResponse = await dispatch(getRazorPayId());
    //         console.log("RazorPay Key after load:", razorPayKeyResponse.payload.key);

    //         const subscriptionIdResponse = await dispatch(purchaseCourseBundle());
    //         console.log("Subscription ID after load:", subscriptionIdResponse.payload.subscription_id);
    //     };
    //     load();
    // }, []);

    async function load() {
        await dispatch(getRazorPayId());
        await dispatch(purchaseCourseBundle(courseId));
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <HomeLayout>
            <form
                onSubmit={handleSubscription}
                className="min-h-[90vh] flex items-center justify-center text-white "
            >
                <div className="w-80 h-[26rem] flex flex-col justify-center shadow-[0_0_10px_black] rounded-lg relative">
                    <h1 className="bg-yellow-500 absolute top-0 w-full text-center p-4 text-2xl font-bold rounded-tl-lg rounded-tr-lg">Subscription Bundle</h1>
                    <div className="px-4 space-y-5 text-center">
                        <p className="text-[17px] font-semibold">
                            This Purchase will allow you to access all available courses
                            of our platform for {" "}
                            <span className="text text-yellow-500">
                                1 Year duration
                            </span>
                            {" "}. All the existing and new launch courses will be also available
                        </p>
                        <p className="flex items-center justify-center gap-1 text-2xl font-bold text-yellow-500">
                            <BiRupee /> <span>499</span> only
                        </p>
                        <div>
                            <p> 100% refund on cancellation</p>
                            <p>* Terms and conditions *</p>
                        </div>
                        <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 absolute bottom-0 w-full left-0 text-xl font-bold rounded-bl-lg rounded-br-lg py-2">
                            Buy now
                        </button>
                    </div>
                </div>
            </form>
        </HomeLayout>
    );
}

export default Checkout;
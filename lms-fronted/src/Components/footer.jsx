import {BsFacebook, BsGithub, BsInstagram, BsLinkedin} from "react-icons/bs";

function Footer() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    return (
        <>
            <footer className='relativem left-0 bottom-0 h-[10vh] py-5 flex flex-col sm:flex-row items-center justify-between text-white bg-gray-800 sm:px-20'>
                <section className="text-lg ">
                    Copyright {year}  | All right reserved
                </section>
                <section className="flex items-center justify-center gap-5 text-2xl text-white sm: mt-2">
                    <a
                        href="https://www.facebook.com/pwskills"
                        target=  "_blank"
                        rel="noopener noreferrer"
                        className="hover:text-yellow-500 transition-all ease-in-out duration-300">
                        <BsFacebook />
                    </a>
                    <a
                        href="https://www.instagram.com/isanketsingh"
                        target=  "_blank"
                        rel="noopener noreferrer"
                        className="hover:text-yellow-500 transition-all ease-in-out duration-300">
                        <BsInstagram />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/shivam-kumar-5815b01a3?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                        target=  "_blank"
                        rel="noopener noreferrer"
                        className="hover:text-yellow-500 transition-all ease-in-out duration-300">
                        <BsLinkedin />
                    </a>
                    <a
                        href="https://github.com/cvamkt"
                        target=  "_blank"
                        rel="noopener noreferrer"
                        className="hover:text-yellow-500 transition-all ease-in-out duration-300">
                        <BsGithub />
                    </a>
                </section>
            </footer>
        </>
    );
}

export default Footer;






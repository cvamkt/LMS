import { BsFacebook, BsGithub, BsInstagram, BsLinkedin } from "react-icons/bs";

function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="w-full bg-gray-800 text-white py-4 px-6 sm:px-20 flex flex-col sm:flex-row items-center justify-between">
            
            <section className="text-sm sm:text-lg text-center sm:text-left">
                Copyright {year} | All rights reserved
            </section>

            <section className="flex items-center gap-5 text-2xl mt-3 sm:mt-0">
                <a
                    href="https://www.facebook.com/pwskills"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-yellow-500 transition duration-300"
                >
                    <BsFacebook />
                </a>

                <a
                    href="https://www.instagram.com/isanketsingh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-yellow-500 transition duration-300"
                >
                    <BsInstagram />
                </a>

                <a
                    href="https://www.linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-yellow-500 transition duration-300"
                >
                    <BsLinkedin />
                </a>

                <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-yellow-500 transition duration-300"
                >
                    <BsGithub />
                </a>
            </section>

        </footer>
    );
}

export default Footer;
import React from "react";
import LogoVPN from "../../public/assets/Logo_2.svg";
import Instagram from "../../public/assets/Icon/instagram.svg";
const Footer = () => {
    return (
        <div className="bg-white-300 pt-14 pb-4">
            <div className="max-w-screen-xl w-full mx-auto px-6 sm:px-8 lg:px-16 grid grid-rows-6 sm:grid-rows-1 grid-flow-row sm:grid-flow-col grid-cols-3 sm:grid-cols-12 gap-4">
                <div className="row-span-2 sm:col-span-4 col-start-1 col-end-4 sm:col-end-5 flex flex-col items-start ">
                    <LogoVPN className="h-20 w-auto mb-6" />
                    <p className="mb-4">
                        <strong className="font-medium">trekyourworld</strong> is a single
                        solution to all your trekking plans, anywhere around the world.
                    </p>
                    <p className="text-gray-400">©{new Date().getFullYear()} - trekyourworld</p>
                </div>
                <div className="row-span-2 sm:col-span-2 sm:col-start-7 sm:col-end-9 flex flex-col">
                    <p className="text-black-600 mb-4 font-medium text-lg">Follow us on</p>
                    <ul className="text-black-500 ">
                        <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
                            <Instagram className="h-6 w-6" />
                        </li>
                    </ul>
                </div>
                <div className="row-span-2 sm:col-span-2 sm:col-start-9 sm:col-end-11 flex flex-col">
                    <p className="text-black-600 mb-4 font-medium text-lg">Engage</p>
                    <ul className="text-black-500">
                        <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
                            About Us{" "}
                        </li>
                        <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
                            Privacy Policy{" "}
                        </li>
                        <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
                            Terms of Service{" "}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Footer;

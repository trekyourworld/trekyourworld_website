import React, { useState, useEffect } from "react";
import { Link as LinkScroll } from "react-scroll";
import TLogo from "../../public/assets/enhanced_logo.svg"

const Header = () => {
    const [activeLink, setActiveLink] = useState(null);
    const [scrollActive, setScrollActive] = useState(false);

    useEffect(() => {
        window.addEventListener("scroll", () => {
            setScrollActive(window.scrollY > 20);
        });
    }, []);

    return (
        <>
            <header
                className={
                    "fixed top-0 w-full  z-30 bg-white-500 transition-all " +
                    (scrollActive ? " shadow-md pt-0" : " pt-4")
                }
            >
                <nav className="max-w-screen-xl px-6 sm:px-8 lg:px-16 mx-auto grid grid-flow-col py-3 sm:py-4">
                    <div className="col-start-1 col-end-2 flex items-center">
                        <TLogo className="h-8 w-auto" />
                    </div>
                </nav>
            </header>
            {/* Mobile Navigation */}

            <nav className="fixed lg:hidden bottom-0 left-0 right-0 z-20 px-4 sm:px-8 shadow-t ">
                <div className="bg-white-500 sm:px-3">
                    <ul className="flex w-full justify-start items-center text-black-500">
                        <LinkScroll
                            activeClass="active"
                            to="about"
                            spy={true}
                            smooth={true}
                            duration={1000}
                            onSetActive={() => {
                                setActiveLink("about");
                            }}
                            className={
                                "mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs border-t-2 transition-all " +
                                (activeLink === "about"
                                    ? "  border-orange-500 text-orange-500"
                                    : " border-transparent")
                            }
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            About
                        </LinkScroll>
                        <LinkScroll
                            activeClass="active"
                            to="feature"
                            spy={true}
                            smooth={true}
                            duration={1000}
                            onSetActive={() => {
                                setActiveLink("feature");
                            }}
                            className={
                                "mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs border-t-2 transition-all " +
                                (activeLink === "feature"
                                    ? "  border-orange-500 text-orange-500"
                                    : " border-transparent ")
                            }
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                />
                            </svg>
                            Feature
                        </LinkScroll>
                    </ul>
                </div>
            </nav>
            {/* End Mobile Navigation */}
        </>
    );
};

export default Header;

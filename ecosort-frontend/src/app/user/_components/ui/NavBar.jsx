"use client";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const [underlineItem, setUnderlineItem] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);
  // const [isLoggedin, setLogin] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";  

  const NavbarItems = [
    { id: 1, name: "Home", href: "/user" },
    // // { id: 2, name: "Sort", href: "/sort" },
    // ...(isLoggedin ? [{ id: 2, name: "Sort", href: "/sort" }] : []),

    // ...(isLoggedin ? [{ id: 3, name: "Dashboard", href: "/dashboard" }] : []),
    { id: 2, name: "Sort", href: "/sort" },
    { id: 3, name: "Dashboard", href: "/dashboard" },

  ];

  const handleItemClick = (id) => {
    setUnderlineItem(id);
  };

  const handleLogout = () => {
    setLogin(false);
    // Add any additional logout logic here (e.g., clearing tokens, redirecting)
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const currentItem = NavbarItems.find((item) => item.href === pathname);
    if (currentItem) {
      setUnderlineItem(currentItem.id);
    } else {
      setUnderlineItem(0); // Reset if no match found
    }
  }, [pathname]);

  const navbarBackground =
    isHomePage && !isScrolled ? "bg-transparent" : "bg-white";
  const textColor = isHomePage && !isScrolled ? "text-white" : "text-black";

  return (
    <div className="w-full">
      <div
        data-aos="fade-down"
        className={`fixed w-full lg:grid grid-cols-3 justify-center items-center px-[5%] py-2 z-50 transition-all duration-300 ${navbarBackground} ${
          isScrolled || !isHomePage ? "shadow-md" : ""
        }`}
      >
        <div className="">
          <Link href="/user">
            <img
              src={
                isHomePage && !isScrolled
                  ? "/photos/ecosortlogo2.png"
                  : "/photos/ecosortgreen.png"
              }
              className="h-16 transition-transform duration-500 ease-in-out transform scale-100"
              style={{
                transition: "opacity 0.5s ease, transform 0.5s ease",
                opacity: 1,
                transform: isScrolled ? "scale(1.1)" : "scale(1.0)",
              }}
              alt="Logo"
            />
          </Link>
        </div>

        <NavigationMenu className="flex gap-10px-[5%] mr-[5%]">
          <NavigationMenuList className="flex gap-24">
            {NavbarItems.map((item) => (
              <NavigationMenuItem key={item.id} className="">
                <Link
                  href={item.href}
                  onClick={() => handleItemClick(item.id)}
                  className={`text-lg font-semibold hover:underline underline-offset-8 decoration-2 ${textColor} ${
                    underlineItem === item.id ? "underline" : ""
                  }`}
                >
                  {item.name}
                </Link>
              </NavigationMenuItem>
            ))}
            {/* {!isLoggedin ? (
              <Link href="/login">
                <button
                  className={`border-2 p-2 rounded-lg ${
                    isHomePage && !isScrolled
                      ? "text-white border-white"
                      : "text-black border-black"
                  }`}
                >
                  Login
                </button>
              </Link>
            ) : (
              <button
                className={`border-2 p-2 rounded-lg ${
                  isHomePage && !isScrolled
                    ? "text-white border-white"
                    : "text-black border-black"
                }`}
                onClick={handleLogout}
              >
                Logout
              </button>
            )} */}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}

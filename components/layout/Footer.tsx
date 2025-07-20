import { homePageSections } from "@/constants/data";
import Link from "next/link";
import { FaFacebook, FaInstagram } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer>
      <div className="w-screen h-full bg-beige flex flex-col items-start justify-start mt-16 px-5 lg:px-10 pt-4 lg:pt-8 pb-16 lg:pb-24 font-dmSans tracking-wide space-y-10">
        <div className="flex flex-col lg:flex-row w-full items-start lg:justify-between space-y-4">
          <div className="flex flex-col xl:space-y-2">
            <h4 className="text-lg lg:text-xl font-semibold uppercase">
              All Jewellery
            </h4>
            <ul className="text-sm lg:text-base space-y-1 xl:space-y-2 *:hover:underline-offset-2 *:hover:underline *:w-fit">
              {homePageSections.map((item, index) => (
                <li key={index}>
                  <Link href={`/productByCategory/${item.section}`}>
                    {item.section}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col xl:space-y-2">
            <h4 className="text-lg lg:text-xl font-semibold uppercase">Info</h4>
            <ul className="text-sm lg:text-base space-y-1 xl:space-y-2 *:hover:underline-offset-2 *:hover:underline *:w-fit">
              <li>About Us</li>
              <li>Privacy Policy</li>
              <li>Terms Of Service</li>
              <li>Refund Policy</li>
              <li>FAQ&apos;s</li>
              <li>Shipping Policy</li>
              <li>Track Order</li>
            </ul>
          </div>

          <div className="[&_p]:text-sm lg:[&_p]:text-base xl:space-y-2">
            <h4 className="text-lg lg:text-xl font-semibold uppercase">
              Contact Us
            </h4>
            <div>
              <p className="font-semibold">Modaura E-commerce Pvt. Ltd.</p>
              <p>support@modaura.in</p>
              <p>Whatsapp +91 9876543210</p>
              <p>XYZ Delhi - 110003</p>
              <p>India</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-lg lg:text-xl font-semibold uppercase">
            Join Our Community
          </h4>
          <ul className="flex flex-row gap-4 lg:gap-8 text-sm lg:text-base space-y-1 lg:space-y-0 *:hover:bg-ivory *:hover:border-ivory *:hover:text-black-1 *:transition-all *:duration-300 *:ease-in-out *:aspect-square">
            <li className="size-auto p-2 border border-black-1 rounded-full">
              <Link
                href="https://www.instagram.com/_modaura.in/"
                target="_blank"
              >
                <FaInstagram />
              </Link>
            </li>
            <li className="size-auto p-2 border border-black-1 rounded-full">
              <Link
                href="https://www.facebook.com/people/ModAura/61574557487011/?ref=pl_edit_xav_ig_profile_page_web#"
                target="_blank"
              >
                <FaFacebook />
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-sm lg:text-base">
          © 2025, Modaura Jewellery. All rights reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;

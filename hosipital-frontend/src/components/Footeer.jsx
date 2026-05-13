import React from "react";
import { Link } from "react-router-dom";
import { BiDonateHeart } from "react-icons/bi";

const Footeer = () => {
  return (
    <footer className="bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:grid lg:grid-cols-4 lg:gap-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            <BiDonateHeart className="inline text-pink-400" /> Healthnest
          </h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
            Modern healthcare powered by technology, compassion, and clear patient support.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-pink-300">Navigation</h4>
          <ul className="mt-4 space-y-2 text-slate-300">
            {/* <li>
              <Link to="/" className="hover:text-white">Home</Link>
            </li> */}
            <li>
              <Link to="/about" className="hover:text-white">About</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white">Contact</Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-white">FAQ</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-pink-300">Resources</h4>
          <ul className="mt-4 space-y-2 text-slate-300">
            <li>
              <Link to="/privacy-policy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-of-service" className="hover:text-white">
                services
              </Link>
            </li>
            <li>
              <Link to="/patient-support" className="hover:text-white">
                Patient Support
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-pink-300">Contact</h4>
          <ul className="mt-4 space-y-2 text-slate-300">
            <li>+91 6230288636</li>
            <li>342 healthnest</li>
            <li>jawali, Himachal predesh</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 px-4 py-5 text-center text-sm text-slate-500">
        © 2026 healthnest Hospital. All rights reserved.
      </div>
    </footer>
  );
};

export default Footeer;
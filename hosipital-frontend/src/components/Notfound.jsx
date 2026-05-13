import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />
      <main className="mx-auto flex min-h-[calc(100vh-144px)] max-w-5xl flex-col items-center justify-center px-4 py-24 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-pink-600">Page not found</p>
        <h1 className="mt-6 text-6xl font-bold text-slate-900">404</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          The page is not Found.
        </p>
        <Link
          to="/"
          className="mt-10 inline-flex rounded-full bg-pink-600 px-8 py-4 text-base font-semibold text-white transition hover:bg-pink-700"
        >
          Go to home
        </Link>
      </main>
    </div>
  );
}
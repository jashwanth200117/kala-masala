import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-12">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm text-gray-600">© {new Date().getFullYear()} KalaMasala. All rights reserved.</div>
        <div className="mt-3 md:mt-0 text-sm text-gray-500">
          <a href="/privacy" className="mr-4 hover:text-gray-700">Privacy</a>
          <a href="/terms" className="hover:text-gray-700">Terms</a>
        </div>
      </div>
    </footer>
  );
}
export default Footer;

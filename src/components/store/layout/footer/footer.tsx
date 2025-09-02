import Contact from "./contact";
import Links from "./links";

export default function Footer() {
  return (
    <div className=" w-full bg-white">
      {/* Newsletter */}
      <div className="max-w-auto mx-auto">
        <div className="p-5">
          <div className="grid md:grid-cols-2 md:gap-x-5">
            <Contact />
            <Links />
          </div>
        </div>
      </div>
      {/* Rights */}
    </div>
  );
}

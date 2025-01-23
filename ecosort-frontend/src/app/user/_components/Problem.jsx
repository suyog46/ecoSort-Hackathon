import { Card } from "@/components/ui/card";

export default function Problem() {
  return (
    <div className="">
      <div className="grid grid-cols-2 gap-10 py-20">
        <div className="w-full flex justify-center items-center" data-aos="fade-right">
          {/* <img src="/photos/problemimg.svg"  className=""/> */}
          <img src="/photos/cute.png" className="object-contain h-72"/>
        </div>
        <div data-aos="fade-up-left " >
            <p className="mt-10  rounded-3xl bg-gray-100 w-28 p-3 text-gray-600 font-semibold">ABOUT US</p>
          <h1 className="text-primary font-bold text-5xl py-5">
            Introduction
          </h1>
          <h1 className="max-w-xl leading-8" >
            EcoSort is an innovative solution designed to tackle the pressing
            issue of improper waste segregation. Using cutting-edge AI
            technology, it can automatically classify and separate biodegradable
            and non-biodegradable waste in real-time. By promoting efficient
            recycling and reducing landfill overflow, this project aims to
            address environmental challenges and create a sustainable,
            eco-friendly waste management system for households, public spaces,
            and industrial applications.
          </h1>
        </div>
      </div>
    </div>
  );
}

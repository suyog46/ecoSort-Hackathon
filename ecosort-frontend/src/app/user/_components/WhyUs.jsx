import { Biohazard } from "lucide-react";

export default function WhyUs() {
  return (
    <div className="relative">
      <img src="/photos/gradient.png" className="z-0 w-full h-[750px]" />
      {/* <div className="absolute z-40  top-0 pt-5 w-full text-center inset-0 bg-gradient-to-r from-black/20 via-black/10 to-transparent"> */}
      <div className="absolute z-40  top-0 pt-14 w-full text-center  flex flex-col items-center">
        <div className="max-w-2xl space-y-3  ">
          <h1 className="text-lg text-green-800" data-aos="fade-right">Types of Wastes</h1>
          <h2 className=" text-4xl font-bold" data-aos="fade-right" data-aos-delay = "300">EcoSort Waste Classification</h2>
          <h3 className="text-lg" data-aos="fade-right" data-aos-delay = "500">
            Streamlining Waste Management by Identifying and Categorizing
            Different Types of Waste for a Greener Future
          </h3>
        </div>
        <div className="grid grid-cols-3 px-20 space-y-5">
          <div className="relative pt-5" data-aos="fade-right" data-aos-delay="600">
            <div className="relative z-20 flex justify-center items-center" >
              <img src="/photos/shape-25.png" alt="shape" />
              <div className="absolute top-[20%] left-0 right-0 flex justify-center items-center">
                <Biohazard className="size-10 text-primary" />
              </div>
              <h1 className="absolute z-50 bottom-5 text-2xl">Biodegradable</h1>
            </div>
            <h1>
              Biodegradable materials break down naturally by microorganisms,
              returning to the environment without harm.
            </h1>
          </div>

          <div className="row-span-2 flex w-full justify-center items-center" data-aos="zoom-in">
            <img src="/photos/bin.png" />
          </div>

          <div className="relative" data-aos="fade-left" data-aos-delay="600">
            <div className="relative z-20 flex justify-center items-center">
              <img src="/photos/shape-25.png" alt="shape" />
              <div className="absolute top-[20%] left-0 right-0 flex justify-center items-center hover:">
                <Biohazard className="size-10 text-primary" />
              </div>
              <h1 className="absolute z-50 bottom-5 text-2xl ">
                Non-Biodegradable
              </h1>
            </div>
            <h1>
              Nonbiodegradable materials do not break down naturally and can
              significantly harm the environment.
            </h1>
          </div>

          <div className="relative" data-aos="fade-right" data-aos-delay="600">
            <div className="relative z-20 flex justify-center items-center">
              <img src="/photos/shape-25.png" alt="shape" />
              <div className="absolute top-[20%] left-0 right-0 flex justify-center items-center hover:">
                <Biohazard className="size-10 text-primary" />
              </div>
              <h1 className="absolute z-50 bottom-5 text-2xl">Biodegradable example: </h1>
            </div>
            <h1>
            Food scraps like apple cores or leaves that decompose naturally over time.
            </h1>
          </div>

          <div className="relative" data-aos="fade-left" data-aos-delay="600">
            <div className="relative z-20 flex justify-center items-center">
              <img src="/photos/shape-25.png" alt="shape" />
              <div className="absolute top-[20%] left-0 right-0 flex justify-center items-center hover:">
                <Biohazard className="size-10 text-primary" />
              </div>
              <h1 className="absolute z-50 bottom-5 text-2xl">Nonbiodegradable example:</h1>
            </div>
            <h1>
            Plastic bottles or Styrofoam, which take hundreds of years to break down.
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Solution() {
  return (
    <div className="">
      <div className="grid grid-cols-2 gap-10 py-20">
        <div className="w-full flex flex-col items-end" data-aos="fade-left">
          <p className="mt-10  rounded-3xl bg-gray-100 p-3 text-center text-gray-600 font-semibold">
            Smarter, Cleaner Future
          </p>
          <h1 className="text-primary font-bold text-5xl py-5">Why us?</h1>
          <div className="max-w-xl leading-8 text-right">
            Smart waste bins with integrated camera and AI for real-time
            tracking of waste which tracks if the waste is biodegradable or
            non-biodegradable. IoT device directs the waste to its respective
            slot based on the categorization. Ultra Sonic Sensor tracks if the
            bin is full, providing timely alerts for waste collection. Automates
            the waste sorting process, reducing manual labor and enhancing
            efficiency in waste management.Helps optimize waste collection,
            promoting recycling and sustainable disposal practices.
          </div>
        </div>
        <div
          className="w-full flex justify-center items-center"
          data-aos="fade-right"
        >
          <img
            src="/photos/recycle1.png"
            className="object-contain h-72 animate-spin-slow"
          />
        </div>
      </div>
    </div>
  );
}

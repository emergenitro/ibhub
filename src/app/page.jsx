import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div className="w-full h-[70vh] flex items-center justify-center flex-wrap bg-linear-to-b from-[#128aec] to-[#005fb8]">
        <div>
          <h1 className="text-3xl font-bold text-center w-full">
            Welcome to Ibis
          </h1>
          <p className="text-center mt-4">
            Your hub for all things IB
          </p>
        </div>
      </div>
    </ div>
  );
}

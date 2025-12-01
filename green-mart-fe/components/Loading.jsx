"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center">
      <DotLottieReact
        src="/assets/GreenLoader.lottie"
        loop
        autoplay
        style={{ width: 300, height: 300 }}
      />
    </div>
  );
};

export default Loading;

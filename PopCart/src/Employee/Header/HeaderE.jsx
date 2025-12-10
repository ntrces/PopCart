import React from "react";
import { Menu } from "./Menu";

export const HeaderSection = () => {
  return (
    <header className="flex items-center gap-8 pl-6 pr-8 py-4 relative self-stretch w-full flex-[0_0_auto] bg-white border-b [border-bottom-style:solid] border">
      <button
        className="p-0 bg-transparent border-0 cursor-pointer"
        aria-label="Open menu"
        type="button"
      >
        <Menu className="!relative !w-5 !h-5" />
      </button>

      <div className="flex items-center gap-2 relative flex-1 grow">
        <div
          className="relative w-5 h-5 border-0 border-none"
          role="img"
          aria-label="Pop Cart logo"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M20 20H0V0H20V20Z" stroke="#0A0A0A"/> <path d="M7.5 15V4.16667L17.5 2.5V13.3333" stroke="#0A0A0A" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/> <path d="M5 17.5C6.38071 17.5 7.5 16.3807 7.5 15C7.5 13.6193 6.38071 12.5 5 12.5C3.61929 12.5 2.5 13.6193 2.5 15C2.5 16.3807 3.61929 17.5 5 17.5Z" stroke="#0A0A0A" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/> <path d="M15 15.8333C16.3807 15.8333 17.5 14.714 17.5 13.3333C17.5 11.9526 16.3807 10.8333 15 10.8333C13.6193 10.8333 12.5 11.9526 12.5 13.3333C12.5 14.714 13.6193 15.8333 15 15.8333Z" stroke="#0A0A0A" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <h1 className="relative w-fit [font-family:'Arimo-Regular',Helvetica] font-normal text-neutral-950 text-base tracking-[0] leading-[19.2px] whitespace-nowrap">
          Pop Cart
        </h1>
      </div>

      <div className="flex w-[93px] items-center justify-end gap-3 relative">
        <div
          className="flex w-9 h-9 items-center justify-center relative ml-[-9.00px] bg-neutral-950 rounded-[18px]"
          role="img"
          aria-label="User avatar"
        >
          <div className="relative w-fit [font-family:'Arimo-Bold',Helvetica] font-bold text-white text-sm tracking-[0] leading-[16.8px] whitespace-nowrap">
            A
          </div>
        </div>

        <div className="inline-flex flex-col h-[34px] items-end justify-center gap-0.5 relative flex-[0_0_auto]">
          <div className="relative self-stretch [font-family:'Arimo-Bold',Helvetica] font-bold text-neutral-950 text-sm tracking-[0] leading-[16.8px]">
            Althea
          </div>

          <div className="relative self-stretch [font-family:'Arimo-Regular',Helvetica] font-normal text-gray-500 text-xs tracking-[0] leading-[14.4px]">
            Employee
          </div>
        </div>
      </div>
    </header>
  );
};

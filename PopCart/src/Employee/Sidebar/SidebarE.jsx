import React from "react";

const navigationItems = [
    {
      id: "order-management",
      label: "Order Management",
      isActive: true,
      icon: [
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">  <path d="M12 7.5C12 8.29565 11.6839 9.05871 11.1213 9.62132C10.5587 10.1839 9.79565 10.5 9 10.5C8.20435 10.5 7.44129 10.1839 6.87868 9.62132C6.31607 9.05871 6 8.29565 6 7.5" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/> <path d="M2.32727 4.5255H15.6728" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/> <path d="M2.55 4.10025C2.35527 4.35989 2.25 4.67569 2.25 5.00025V15C2.25 15.3978 2.40804 15.7794 2.68934 16.0607C2.97064 16.342 3.35218 16.5 3.75 16.5H14.25C14.6478 16.5 15.0294 16.342 15.3107 16.0607C15.592 15.7794 15.75 15.3978 15.75 15V5.00025C15.75 4.67569 15.6447 4.35989 15.45 4.10025L13.95 2.1C13.8103 1.91371 13.6291 1.7625 13.4208 1.65836C13.2125 1.55422 12.9829 1.5 12.75 1.5H5.25C5.01713 1.5 4.78746 1.55422 4.57918 1.65836C4.3709 1.7625 4.18972 1.91371 4.05 2.1L2.55 4.10025Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

      ],
      fontFamily: "[font-family:'Arimo-Bold',Helvetica]",
      fontWeight: "font-bold",
      textColor: "text-white",
    },
    {
      id: "product-management",
      label: "Product Management",
      isActive: false,
      icon: [
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M8.25 16.2975C8.47803 16.4291 8.7367 16.4985 9 16.4985C9.2633 16.4985 9.52197 16.4291 9.75 16.2975L15 13.2975C15.2278 13.166 15.417 12.9769 15.5487 12.7491C15.6803 12.5214 15.7497 12.263 15.75 12V5.99999C15.7497 5.73694 15.6803 5.4786 15.5487 5.25086C15.417 5.02312 15.2278 4.83401 15 4.70249L9.75 1.70249C9.52197 1.57084 9.2633 1.50153 9 1.50153C8.7367 1.50153 8.47803 1.57084 8.25 1.70249L3 4.70249C2.7722 4.83401 2.58299 5.02312 2.45135 5.25086C2.31971 5.4786 2.25027 5.73694 2.25 5.99999V12C2.25027 12.263 2.31971 12.5214 2.45135 12.7491C2.58299 12.9769 2.7722 13.166 3 13.2975L8.25 16.2975Z" stroke="#0A0A0A" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/> <path d="M9 16.5V9" stroke="#0A0A0A" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/> <path d="M2.46753 5.25L9.00003 9L15.5325 5.25" stroke="#0A0A0A" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/> <path d="M5.625 3.2025L12.375 7.065" stroke="#0A0A0A" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      ],
      fontFamily: "[font-family:'Arimo-Regular',Helvetica]",
      fontWeight: "font-normal",
      textColor: "text-neutral-950",
    },
  ];


export default function NavigationSidebarSection () {
  
  return (
    <nav
      className="inline-flex flex-col items-start gap-6 relative self-stretch flex-[0_0_auto] border-r [border-right-style:solid] border"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex flex-col items-start gap-0.5 pt-4 pb-0 px-0 relative self-stretch w-full flex-[0_0_auto]">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            className={`flex ${item.isActive ? "w-[200px]" : ""} h-11 items-center gap-3 px-5 py-3 relative ${item.isActive ? "" : "self-stretch w-full"} ${item.isActive ? "bg-neutral-950" : ""} rounded-md hover:bg-neutral-100 transition-colors`}
            aria-current={item.isActive ? "page" : undefined}
            type="button"
          >
            <div className="relative w-[18px] h-[18px]" aria-hidden="true">
              {item.icon.map((iconPart, index) => (
                <img
                  key={index}
                  className={iconPart.className}
                  alt=""
                  src={iconPart.src}
                />
              ))}
            </div>

            <span
              className={`relative w-fit ${item.id === "product-management" ? "mr-[-4.00px]" : ""} ${item.fontFamily} ${item.fontWeight} ${item.textColor} text-sm tracking-[0] leading-[16.8px] whitespace-nowrap`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col items-start relative flex-1 self-stretch w-full grow">
        <button
          className="flex items-start gap-3 px-5 py-3 relative flex-1 self-stretch w-full grow rounded-md hover:bg-red-50 transition-colors"
          type="button"
          aria-label="Sign out of your account"
        >
          <div className="relative w-[18px] h-[18px]" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M12 12.75L15.75 9L12 5.25" stroke="#EF4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M15.75 9H6.75" stroke="#EF4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M6.75 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V3.75C2.25 3.35218 2.40804 2.97064 2.68934 2.68934C2.97064 2.40804 3.35218 2.25 3.75 2.25H6.75" stroke="#EF4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>

          <span className="relative w-fit [font-family:'Inter-Medium',Helvetica] font-medium text-red-500 text-sm tracking-[0] leading-[16.8px] whitespace-nowrap">
            Sign Out
          </span>
        </button>
      </div>
    </nav>
  );
};

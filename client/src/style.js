const styles = {
  boxWidth: "px-44 w-screen",

  heading2:
    " font-semibold xs:text-[48px] text-[40px] text-white xs:leading-[76.8px] leading-[66.8px] w-full",
  paragraph: " font-normal text-[18px] leading-[30.8px]",

  flexCenter: "flex justify-center items-center",
  flexStart: "flex justify-center items-start",

  paddingX: "sm:px-40 px-6",
  paddingY: "sm:py-16 py-6",
  padding: "sm:px-16 px-6 sm:py-12 py-4",
  paddingMin: "sm:px-16 px-6 sm:py-4 py-2",
  paddingMinX: "sm:px-16 px-6",

  marginX: "sm:mx-16 mx-6",
  marginY: "sm:my-16 my-6",
  input:
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#A62D82] focus:border-[#A62D82] focus:z-10 sm:text-sm flex-grow focus:text-[#A62D82] ",
  input2:
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#A62D82] focus:border-[#A62D82] focus:z-10 sm:text-sm flex-grow focus:text-[#A62D82] ",
  activeTab:
    " ml-3 border border-[#E4E6ED] border-[2px] rounded-xl focus:outline-none focus:ring-[#A62D82] focus:border-[#A62D82] focus:z-10 sm:text-sm",
};

export const layout = {
  section: `flex md:flex-row flex-col ${styles.paddingY}`,
  sectionReverse: `flex md:flex-row flex-col-reverse ${styles.paddingY}`,

  sectionImgReverse: `flex-1 flex ${styles.flexCenter} md:mr-10 mr-0 md:mt-0 mt-10 relative`,
  sectionImg: `flex-1 flex ${styles.flexCenter} md:ml-10 ml-0 md:mt-0 mt-10 relative`,

  sectionInfo: `flex-1 ${styles.flexStart} flex-col`,
};

export default styles;

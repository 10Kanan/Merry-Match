import React from "react";
import { x } from "../../assets/indexAsset";

const ModalCustom = ({
  label,
  page,
  packageId,
  des,
  open,
  onClose,
  yesLabel,
  noLabel,
  onYes,
}) => {
  if (!open) return null;
  return (
    <div onClick={onClose} className="overlay">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="modalSelectContainer shadow-sm border-gray-200 border hover:shadow-2xl"
      >
        <div className="">
          <div className="px-7 py-5 flex flow-rol text-black text-h1 text-[20px]">
            <p>{label}</p>
            <p
              className=" cursor-pointer fixed top-6 right-9"
              onClick={onClose}
            >
              <img
                src={x}
                alt="x"
                className=" w-[25px] rounded-full hover:shadow-md"
              />
            </p>
          </div>
          <div className="px-7 flex flex-col">
            <hr className="border-b-3 border-black-400 border-solid text-[#646D89] text-b1" />
            <p className="py-5">{des}</p>
          </div>
          <div className="flex px-7 py-3 pb-5 justify-between">
            <button
              className="hover:shadow-md px-5 mx-2 btSecondary"
              onClick={onYes}
            >
              {yesLabel}
            </button>
            <button
              onClick={onClose}
              className="hover:shadow-md px-5 mx-2 py-3 btPrimary"
            >
              {noLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCustom;

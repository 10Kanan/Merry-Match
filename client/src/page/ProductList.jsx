import React, { useState } from "react";
import ProductModal from "../components/ProductModal";
import { ModalCustom, ProfilePopup } from "../components/indexComponent";
import { userInfo } from "../constants/indexConstants";

const ProductList = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectUser, setSelecteUser] = useState(userInfo[0]);

  return (
    <>
      {/* <div>
        <button onClick={() => setOpenModal(true)} className="modalButton">
          Modal test
        </button>
        <ModalCustom
          open={openModal}
          onClose={() => setOpenModal(false)}
          // onYes={} สิ่งที่จะทำต่อไปเช่น ส่งรีเควสไปหาซว แล้วเนวิเกตเพจ
          label="title"
          des="test"
          yesLabel="yes"
          noLabel="no"
        />
      </div> */}

      <div>
        <button onClick={() => setOpenModal(true)} className="modalButton">
          Modal profile test
        </button>
        <ProfilePopup
          open={openModal}
          {...selectUser}
          onClose={() => setOpenModal(false)}
        />
      </div>
    </>
  );
};

export default ProductList;

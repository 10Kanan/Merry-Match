import styles from "../style";
import Button from "./ButtonCustom";
import { cta } from "../assets/indexAsset";
import { Link } from "react-router-dom";
const CTA = () => (
  <section className={`${styles.flexCenter} relative pt-20 pb-[120px]`}>
    <img
      src={cta}
      alt=""
      className=" object-contain w-full rounded-[20px] box-shadow"
    />
    <div className=" absolute top-50">
      <div className="flex-1 flex flex-col z-10">
        <h2 className="text-[50px] text-h4 pt-10 text-white text-center">
          Let’s start finding
          <br />
          and matching someone new
        </h2>
      </div>

      <div className={`${styles.flexCenter} z-10`}>
        <Link to="/discoverpage">
          <Button
            label="Start Matching!"
            isStyle={"btSecondary py-3 px-6 my-10"}
          />
        </Link>
      </div>
    </div>
  </section>
);

export default CTA;

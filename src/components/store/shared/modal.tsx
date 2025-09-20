"use client";
// icons
import { X } from "lucide-react";
// React
import { Dispatch, FC, ReactNode, SetStateAction } from "react";

interface ModalProps {
  title?: String;
  show?: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ children, setShow, show, title }) => {
  if (show) {
    return (
      <div className="w-full h-full fixed top-0 left-0 right-0 bottom-0 bg-gray-50/65 z-50">
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-10 min-w-[800px] max-w-[900px] py-5 shadow-md rounded-lg">
          <div className="flex items-center justify-between border-b pb-2">
            <h1 className="text-xl font-bold">{title}</h1>
            <X
              className="w-4 h-4 cursor-pointer"
              onClick={() => setShow(false)}
            />
          </div>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    );
  } else return null;
};

export default Modal;

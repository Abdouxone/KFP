"use client";
import { FC } from "react";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "next-share";
import { cn } from "@/lib/utils";

interface Props {
  url: string;
  quote: string;
  isCol?: boolean;
}

const SocialShare: FC<Props> = ({ url, quote, isCol }) => {
  return (
    <div
      className={cn("flex flex-wrap justify-center gap-2", {
        "flex-col": isCol,
      })}
    >
      <FacebookShareButton url={url} quote={quote} hashtag="KFP">
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <TwitterShareButton url={url} title={quote}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <WhatsappShareButton url={url} title={quote} separator=":: ">
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>
    </div>
  );
};

export default SocialShare;

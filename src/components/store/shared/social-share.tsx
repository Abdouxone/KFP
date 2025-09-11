// React
import { FC } from "react";

// next share
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TwitterShareButton,
  TwitterIcon,
} from "next-share";
interface Props {
  url: string;
  quote: string;
}

const SocialShare: FC<Props> = ({ url, quote }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 ">
      <FacebookShareButton url={url} quote={quote} hashtag="#kfp">
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <WhatsappShareButton url={url} title={quote} separator=":: ">
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>
      <TwitterShareButton url={url} title={quote}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>
    </div>
  );
};

export default SocialShare;

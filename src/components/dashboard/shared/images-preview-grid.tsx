// React, Next.js
import Image from "next/image";
import { FC } from "react";

// Import of the image shown when there are no images available
import NoImageImg from "../../../../public/assets/images/no_image_2.png";
import { cn, getGridClassName } from "@/lib/utils";

interface ImagesPreviewGridProps {
  images: { url: string }[];
  onRemove: (value: string) => void;
}

const ImagesPreviewGrid: FC<ImagesPreviewGridProps> = ({
  images,
  onRemove,
}) => {
  // Calculate the number of images
  let imagesLength = images.length;

  // Get the grid class name based on the number of images
  const GridClassName = getGridClassName(imagesLength);

  // If there are no images, display a placeholder image
  if (imagesLength === 0) {
    return (
      <div>
        <Image
          src={NoImageImg}
          alt="No image found"
          width={500}
          height={600}
          className="rounded-md"
        />
      </div>
    );
  } else {
    // if there are images, display the images in a grid
    return (
      <div className="max-w-4xl">
        <div
          className={cn(
            "grid h-[800px] overflow-hidden bg-white rounded-md",
            GridClassName
          )}
        >
          {images.map((img, i) => (
            <div
              key={i}
              className={cn(
                "relative group h-full w-full border border-gray-300",
                `grid_${imagesLength}_image_${i + 1}`,
                {
                  "h-[266.66]": imagesLength === 6,
                }
              )}
            >
              {/* Image */}
              <Image
                src={img.url}
                alt=""
                width={800}
                height={800}
                className="w-full h-full object-cover object-top"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default ImagesPreviewGrid;

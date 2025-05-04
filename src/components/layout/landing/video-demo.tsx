import HeroVideoDialog from "@/components/magicui/hero-video-dialog";


export default function VideoDemo() {
  return (
    <section className="py-10 md:py-12 lg:py-20 bg-linear-to-b dark:block">
      <div className="mx-auto flex flex-col w-full items-center max-w-5xl space-y-8 px-6 md:space-y-16 lg:space-y-20">

        <div className="relative z-10 mx-auto max-w-2xl space-y-6 text-center">
          <h2 className="text-4xl font-semibold lg:text-5xl">
            Conquer Your Syllabus in Seconds
          </h2>
          <p>
            See how uploading your syllabus creates your visual study map. Watch the demo to grasp connections, get instant answers, and track exam prep simply.          </p>
        </div>

        <div className="flex justify-center max-w-2xl">
          <div className="relative">
            <HeroVideoDialog
              className="block dark:hidden"
              animationStyle="from-center"
              videoSrc="https://youtube.com/embed/UhWC9oLkasg?si=EhSI2BXJ7hkQMaM8"
              thumbnailSrc="/og_image.png"
              thumbnailAlt="Hero Video"
            />
            <HeroVideoDialog
              className="hidden dark:block"
              animationStyle="from-center"
              videoSrc="https://youtube.com/embed/UhWC9oLkasg?si=EhSI2BXJ7hkQMaM8"
              thumbnailSrc="/og_image.png"
              thumbnailAlt="Hero Video"
            />
          </div>
        </div>


      </div>
    </section>
  );
}

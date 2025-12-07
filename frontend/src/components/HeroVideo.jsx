function HeroVideo() {
  return (
    <section className="w-full bg-black">
      <div className="w-full px-0 pb-10 pt-0">
        <div className="w-full">
          <video
            className="h-[75vh] w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            poster="https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&w=1600&q=60"
          >
            <source src="/video/Slider.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  )
}

export default HeroVideo


const TestimonialsSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-secondary/30">
      <div className="container">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Trusted by thousands of{" "}
            <span className="bg-gradient-primary bg-clip-text text-[#296465]">
              happy residents
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what property managers and residents are saying about their
            Gatewise experience.
          </p>
        </div>

        <div className="relative rounded-3xl overflow-hidden">
          {/* <Image
            src={happyResidents}
            alt="Happy residents in modern apartment building"
            className="w-full h-64 lg:h-96 object-cover"
          /> */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 flex items-center justify-center">
            <div className="text-center text-white space-y-4">
              <h3 className="text-2xl lg:text-3xl font-bold">
                Join thousands of satisfied residents
              </h3>
              <p className="text-lg opacity-90">
                Experience the future of community access control
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

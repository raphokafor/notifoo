import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 lg:py-32 bg-[#296465] w-full flex justify-center items-center">
      <div className="container text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-white">
            Ready to modernize your community access?
          </h2>
          <p className="text-lg text-white/90">
            Join thousands of properties that have already made the switch to
            smarter, more reliable access control.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 sm:justify-center">
            <Button
              variant="default"
              size="lg"
              className="bg-white text-[#296465] hover:bg-white/90"
            >
              Request a Demo
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white bg-transparent hover:bg-white/10"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

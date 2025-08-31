import { Smartphone, Shield, Clock, Users } from "lucide-react";

const features = [
  {
    icon: Smartphone,
    title: "Open gates with your phone",
    description:
      "Easily access the community with the tap of a button on your gate app or use voice commands like 'Hey Siri'",
  },
  {
    icon: Shield,
    title: "Enhanced security",
    description:
      "Advanced encryption and secure protocols ensure your community stays protected while maintaining convenience",
  },
  {
    icon: Clock,
    title: "24/7 reliability",
    description:
      "Our system works around the clock with 99.9% uptime, ensuring you never get locked out of your community",
  },
  {
    icon: Users,
    title: "Easy management",
    description:
      "Property managers can easily add, remove, and manage resident access from one centralized dashboard",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 lg:py-32">
      <div className="container">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            It's time gate entry systems were{" "}
            <span className="bg-gradient-primary bg-clip-text text-[#296465]">
              re-imagined
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Tired of dealing with clickers, key fobs, broken call boxes, and key
            pads that everyone has the code to? Provide your residents with our
            top rated gate app that offers more reliable and convenient
            community access than traditional systems.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-[#296465] rounded-2xl flex items-center justify-center shadow-elegant">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

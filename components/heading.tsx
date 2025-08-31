"use client";

interface HeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}

const Heading: React.FC<HeadingProps> = ({
  title,
  subtitle,
  center = false,
  className,
}) => {
  return (
    <div className={`${center ? "text-center" : "text-start"} ${className}`}>
      <div className="text-2xl font-semibold">{title}</div>
      <div className="font-light text-sm text-neutral-500 mt-2">{subtitle}</div>
    </div>
  );
};

export default Heading;

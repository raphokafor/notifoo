import React from "react";

const HeaderComponent = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur">
        <div className="px-6 py-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            <p className="text-sm text-slate-600">{description}</p>
          </div>
        </div>
      </header>
    </div>
  );
};

export default HeaderComponent;

type SectionHeadingProps = {
  children: React.ReactNode;
};

export default function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
      {children}
    </h2>
  );
}

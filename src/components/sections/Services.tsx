import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceCard from "@/components/ui/ServiceCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { SERVICE_ICONS } from "@/components/ui/Icons";
import { SERVICES } from "@/lib/constants";

export default function Services() {
  const t = useTranslations("Services");

  return (
    <section id="services" className="bg-turtle-50/50 py-20">
      <Container>
        <ScrollReveal>
          <SectionHeading>{t("heading")}</SectionHeading>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {SERVICES.map((service, i) => (
            <ServiceCard
              key={service.key}
              icon={SERVICE_ICONS[service.key]}
              title={t(`${service.key}.title`)}
              description={t(`${service.key}.description`)}
              index={i}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
